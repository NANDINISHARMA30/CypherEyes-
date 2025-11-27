"""
Autoencoder Training Module for Hybrid IDS
Trains reconstruction-based anomaly detector on normal network traffic
Optimized for FPR < 5% constraint
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import RobustScaler
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from tqdm import tqdm
import warnings
warnings.filterwarnings('ignore')


class NetworkTrafficDataset(Dataset):
    """PyTorch Dataset for network traffic data"""
    def __init__(self, data):
        self.data = torch.FloatTensor(data)
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        return self.data[idx]


class AnomalyAutoencoder(nn.Module):
    """
    Deep Autoencoder for anomaly detection via reconstruction error
    Architecture: Input -> Encoder -> Latent -> Decoder -> Reconstructed
    """
    def __init__(self, input_dim=120, latent_dim=32, hidden_dims=[64, 48]):
        super(AnomalyAutoencoder, self).__init__()
        
        # Encoder: Compress to latent representation
        encoder_layers = []
        prev_dim = input_dim
        for hidden_dim in hidden_dims:
            encoder_layers.extend([
                nn.Linear(prev_dim, hidden_dim),
                nn.BatchNorm1d(hidden_dim),
                nn.ReLU(),
                nn.Dropout(0.2)
            ])
            prev_dim = hidden_dim
        
        encoder_layers.append(nn.Linear(prev_dim, latent_dim))
        encoder_layers.append(nn.ReLU())
        self.encoder = nn.Sequential(*encoder_layers)
        
        # Decoder: Reconstruct from latent space
        decoder_layers = []
        prev_dim = latent_dim
        for hidden_dim in reversed(hidden_dims):
            decoder_layers.extend([
                nn.Linear(prev_dim, hidden_dim),
                nn.BatchNorm1d(hidden_dim),
                nn.ReLU(),
                nn.Dropout(0.2)
            ])
            prev_dim = hidden_dim
        
        decoder_layers.append(nn.Linear(prev_dim, input_dim))
        # No activation on output for normalized data
        self.decoder = nn.Sequential(*decoder_layers)
    
    def forward(self, x):
        latent = self.encoder(x)
        reconstructed = self.decoder(latent)
        return reconstructed
    
    def get_latent_representation(self, x):
        """Get compressed latent features"""
        return self.encoder(x)


class AutoencoderTrainer:
    """Handles training, validation, and threshold optimization"""
    
    def __init__(self, input_dim=120, latent_dim=32, device='cuda' if torch.cuda.is_available() else 'cpu'):
        self.device = device
        self.model = AnomalyAutoencoder(input_dim=input_dim, latent_dim=latent_dim).to(device)
        self.scaler = RobustScaler()
        self.threshold = None
        self.training_history = {'train_loss': [], 'val_loss': []}
        
    def prepare_data(self, X_normal, validation_split=0.2, batch_size=256):
        """
        Prepare normal traffic data for training
        Args:
            X_normal: Normal traffic samples (label == 0)
            validation_split: Fraction for validation
            batch_size: Batch size for training
        """
        # Scale data
        X_scaled = self.scaler.fit_transform(X_normal)
        
        # Train/validation split
        X_train, X_val = train_test_split(X_scaled, test_size=validation_split, random_state=42)
        
        # Create DataLoaders
        train_dataset = NetworkTrafficDataset(X_train)
        val_dataset = NetworkTrafficDataset(X_val)
        
        self.train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        self.val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
        
        print(f"Training samples: {len(X_train)}, Validation samples: {len(X_val)}")
        print(f"Using device: {self.device}")
        
        return X_train, X_val
    
    def train(self, epochs=50, learning_rate=0.001, patience=10):
        """
        Train autoencoder with early stopping
        Args:
            epochs: Maximum training epochs
            learning_rate: Adam optimizer learning rate
            patience: Early stopping patience
        """
        criterion = nn.MSELoss()
        optimizer = optim.Adam(self.model.parameters(), lr=learning_rate, weight_decay=1e-5)
        scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=5)
        
        best_val_loss = float('inf')
        early_stop_counter = 0
        
        print(f"\n{'='*60}")
        print(f"Starting Autoencoder Training")
        print(f"{'='*60}")
        
        for epoch in range(epochs):
            # Training phase
            self.model.train()
            train_loss = 0
            for batch in tqdm(self.train_loader, desc=f"Epoch {epoch+1}/{epochs}", leave=False):
                batch = batch.to(self.device)
                
                optimizer.zero_grad()
                reconstructed = self.model(batch)
                loss = criterion(reconstructed, batch)
                loss.backward()
                optimizer.step()
                
                train_loss += loss.item()
            
            avg_train_loss = train_loss / len(self.train_loader)
            
            # Validation phase
            self.model.eval()
            val_loss = 0
            with torch.no_grad():
                for batch in self.val_loader:
                    batch = batch.to(self.device)
                    reconstructed = self.model(batch)
                    loss = criterion(reconstructed, batch)
                    val_loss += loss.item()
            
            avg_val_loss = val_loss / len(self.val_loader)
            
            # Record history
            self.training_history['train_loss'].append(avg_train_loss)
            self.training_history['val_loss'].append(avg_val_loss)
            
            # Learning rate scheduling
            scheduler.step(avg_val_loss)
            
            # Early stopping check
            if avg_val_loss < best_val_loss:
                best_val_loss = avg_val_loss
                early_stop_counter = 0
                # Save best model
                torch.save(self.model.state_dict(), 'autoencoder_best.pth')
            else:
                early_stop_counter += 1
            
            # Print progress
            if (epoch + 1) % 5 == 0 or early_stop_counter == 0:
                print(f"Epoch {epoch+1:3d} | Train Loss: {avg_train_loss:.6f} | "
                      f"Val Loss: {avg_val_loss:.6f} | LR: {optimizer.param_groups[0]['lr']:.6f}")
            
            # Stop if no improvement
            if early_stop_counter >= patience:
                print(f"\nEarly stopping triggered at epoch {epoch+1}")
                break
        
        # Load best model
        self.model.load_state_dict(torch.load('autoencoder_best.pth'))
        print(f"\n{'='*60}")
        print(f"Training completed! Best validation loss: {best_val_loss:.6f}")
        print(f"{'='*60}\n")
    
    def compute_reconstruction_errors(self, X):
        """
        Compute reconstruction error for each sample
        Args:
            X: Input samples (already scaled)
        Returns:
            Array of reconstruction errors (MSE per sample)
        """
        self.model.eval()
        dataset = NetworkTrafficDataset(X)
        loader = DataLoader(dataset, batch_size=256, shuffle=False)
        
        errors = []
        with torch.no_grad():
            for batch in loader:
                batch = batch.to(self.device)
                reconstructed = self.model(batch)
                # MSE per sample
                error = ((batch - reconstructed) ** 2).mean(dim=1).cpu().numpy()
                errors.extend(error)
        
        return np.array(errors)
    
    def optimize_threshold_for_fpr(self, X_normal, X_attack, target_fpr=0.05):
        """
        Find optimal threshold to achieve target FPR
        Args:
            X_normal: Normal traffic samples for FPR calculation
            X_attack: Attack samples for TPR calculation
            target_fpr: Target false positive rate (default 5%)
        Returns:
            threshold, achieved_fpr, achieved_tpr
        """
        print(f"\n{'='*60}")
        print(f"Optimizing Threshold for FPR < {target_fpr*100:.1f}%")
        print(f"{'='*60}")
        
        # Scale data
        X_normal_scaled = self.scaler.transform(X_normal)
        X_attack_scaled = self.scaler.transform(X_attack)
        
        # Compute reconstruction errors
        normal_errors = self.compute_reconstruction_errors(X_normal_scaled)
        attack_errors = self.compute_reconstruction_errors(X_attack_scaled)
        
        # Try different percentiles
        best_threshold = None
        best_fpr = 1.0
        best_tpr = 0.0
        
        print(f"\nTesting thresholds...")
        print(f"{'Percentile':<12}{'Threshold':<15}{'FPR':<10}{'TPR':<10}")
        print(f"{'-'*50}")
        
        for percentile in range(90, 100):
            threshold = np.percentile(normal_errors, percentile)
            
            # Calculate FPR (normal flagged as attack)
            fp = np.sum(normal_errors > threshold)
            fpr = fp / len(normal_errors)
            
            # Calculate TPR (attacks correctly detected)
            tp = np.sum(attack_errors > threshold)
            tpr = tp / len(attack_errors)
            
            print(f"{percentile:<12}{threshold:<15.6f}{fpr*100:<10.2f}{tpr*100:<10.2f}")
            
            # Choose threshold that meets FPR constraint with best TPR
            if fpr <= target_fpr and tpr > best_tpr:
                best_threshold = threshold
                best_fpr = fpr
                best_tpr = tpr
        
        if best_threshold is None:
            # Fallback: choose threshold with FPR closest to target
            threshold = np.percentile(normal_errors, 95)
            fp = np.sum(normal_errors > threshold)
            best_fpr = fp / len(normal_errors)
            tp = np.sum(attack_errors > threshold)
            best_tpr = tp / len(attack_errors)
            best_threshold = threshold
            print(f"\nWARNING: Could not meet FPR target. Using 95th percentile.")
        
        self.threshold = best_threshold
        
        print(f"\n{'='*60}")
        print(f"Optimal Threshold: {self.threshold:.6f}")
        print(f"Achieved FPR: {best_fpr*100:.2f}%")
        print(f"Achieved TPR: {best_tpr*100:.2f}%")
        print(f"{'='*60}\n")
        
        return self.threshold, best_fpr, best_tpr
    
    def predict(self, X):
        """
        Predict if samples are anomalies
        Args:
            X: Input samples
        Returns:
            predictions (0=normal, 1=anomaly), reconstruction_errors
        """
        X_scaled = self.scaler.transform(X)
        errors = self.compute_reconstruction_errors(X_scaled)
        predictions = (errors > self.threshold).astype(int)
        return predictions, errors
    
    def save_model(self, filepath='autoencoder_model.pth'):
        """Save trained model and artifacts"""
        torch.save({
            'model_state_dict': self.model.state_dict(),
            'scaler': self.scaler,
            'threshold': self.threshold,
            'training_history': self.training_history
        }, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='autoencoder_model.pth'):
        """Load trained model and artifacts"""
        checkpoint = torch.load(filepath)
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.scaler = checkpoint['scaler']
        self.threshold = checkpoint['threshold']
        self.training_history = checkpoint['training_history']
        print(f"Model loaded from {filepath}")
    
    def plot_training_history(self):
        """Visualize training progress"""
        plt.figure(figsize=(10, 5))
        plt.plot(self.training_history['train_loss'], label='Train Loss')
        plt.plot(self.training_history['val_loss'], label='Validation Loss')
        plt.xlabel('Epoch')
        plt.ylabel('MSE Loss')
        plt.title('Autoencoder Training History')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig('autoencoder_training_history.png', dpi=150)
        print("Training history plot saved to autoencoder_training_history.png")
        plt.show()


if __name__ == "__main__":
    print("Autoencoder Trainer Module Loaded")
    print("Use this module in conjunction with your main training notebook")
