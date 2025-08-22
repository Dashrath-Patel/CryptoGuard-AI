// lib/realtime-bnb-monitor.ts
export class RealTimeBNBMonitor {
  private static instance: RealTimeBNBMonitor;
  private subscribers: Map<string, Function[]> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  static getInstance(): RealTimeBNBMonitor {
    if (!RealTimeBNBMonitor.instance) {
      RealTimeBNBMonitor.instance = new RealTimeBNBMonitor();
    }
    return RealTimeBNBMonitor.instance;
  }

  // Subscribe to real-time BNB price updates
  subscribeToBNBPrice(callback: (price: string) => void): () => void {
    const key = 'bnb-price';
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    
    this.subscribers.get(key)!.push(callback);

    // Start monitoring if first subscriber
    if (this.subscribers.get(key)!.length === 1) {
      this.startBNBPriceMonitoring();
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(key) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      
      // Stop monitoring if no subscribers
      if (callbacks.length === 0) {
        this.stopMonitoring(key);
      }
    };
  }

  // Subscribe to real-time gas price updates
  subscribeToGasPrice(callback: (gasPrice: string) => void): () => void {
    const key = 'gas-price';
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    
    this.subscribers.get(key)!.push(callback);

    if (this.subscribers.get(key)!.length === 1) {
      this.startGasPriceMonitoring();
    }

    return () => {
      const callbacks = this.subscribers.get(key) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      
      if (callbacks.length === 0) {
        this.stopMonitoring(key);
      }
    };
  }

  // Subscribe to real-time block updates
  subscribeToBlocks(callback: (blockNumber: number) => void): () => void {
    const key = 'blocks';
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    
    this.subscribers.get(key)!.push(callback);

    if (this.subscribers.get(key)!.length === 1) {
      this.startBlockMonitoring();
    }

    return () => {
      const callbacks = this.subscribers.get(key) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      
      if (callbacks.length === 0) {
        this.stopMonitoring(key);
      }
    };
  }

  private async startBNBPriceMonitoring() {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
        const data = await response.json();
        const price = data.price ? `$${parseFloat(data.price).toFixed(2)}` : '$300.50';
        
        this.notifySubscribers('bnb-price', price);
      } catch (error) {
        console.error('Failed to fetch BNB price:', error);
      }
    };

    // Fetch immediately
    fetchPrice();
    
    // Then fetch every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    this.intervals.set('bnb-price', interval);
  }

  private async startGasPriceMonitoring() {
    const fetchGasPrice = async () => {
      try {
        const response = await fetch('/api/gas-tracker');
        const data = await response.json();
        this.notifySubscribers('gas-price', data.gasPrice || '5 gwei');
      } catch (error) {
        console.error('Failed to fetch gas price:', error);
      }
    };

    fetchGasPrice();
    const interval = setInterval(fetchGasPrice, 15000); // Every 15 seconds
    this.intervals.set('gas-price', interval);
  }

  private async startBlockMonitoring() {
    const fetchLatestBlock = async () => {
      try {
        const response = await fetch('/api/latest-block');
        const data = await response.json();
        this.notifySubscribers('blocks', data.blockNumber || 12345678);
      } catch (error) {
        console.error('Failed to fetch latest block:', error);
      }
    };

    fetchLatestBlock();
    const interval = setInterval(fetchLatestBlock, 10000); // Every 10 seconds
    this.intervals.set('blocks', interval);
  }

  private notifySubscribers(key: string, data: any) {
    const callbacks = this.subscribers.get(key) || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  private stopMonitoring(key: string) {
    const interval = this.intervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(key);
    }
    this.subscribers.delete(key);
  }

  // Clean up all monitoring
  cleanup() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.subscribers.clear();
  }
}
