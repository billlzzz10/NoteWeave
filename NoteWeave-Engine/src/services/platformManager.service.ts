// platformManager.service.ts
// Service for managing platform connections in NoteWeave

import { BasePlatformConnector } from './platforms/base-platform-connector';
import { IPlatformConnector } from './platforms/platform-connector.interface';
import { 
  PlatformType, 
  PlatformConfig, 
  PlatformSummary, 
  PlatformItem,
  SyncOptions,
  SyncResult
} from '../types/platform';
import { ProgressCallback } from '../types';

/**
 * Service that manages connections to external platforms
 */
export class PlatformManagerService {
  private connectors: Map<PlatformType, IPlatformConnector> = new Map();
  private connections: Map<string, PlatformSummary> = new Map();
  
  constructor() {
    // Initialize platform connectors will be done in registerPlatform method
  }
  
  /**
   * Register a platform connector
   * @param connector The platform connector to register
   * @param platformType The platform type
   */
  public registerPlatform(connector: IPlatformConnector, platformType: PlatformType): void {
    if (this.connectors.has(platformType)) {
      throw new Error(`Platform type ${platformType} is already registered`);
    }
    
    this.connectors.set(platformType, connector);
  }
  
  /**
   * Get all supported platform types
   * @returns List of supported platform types
   */
  public getSupportedPlatforms(): PlatformType[] {
    return Array.from(this.connectors.keys());
  }
  
  /**
   * Connect to a platform
   * @param config The platform configuration
   * @returns The platform connection information
   */
  public async connectToPlatform(config: PlatformConfig): Promise<PlatformSummary> {
    const { platformType } = config;
    const connector = this.connectors.get(platformType);
    
    if (!connector) {
      throw new Error(`Platform type ${platformType} is not supported`);
    }
    
    try {
      // Connect to the platform
      const summary = await connector.connect(config);
      
      // Store the connection
      this.connections.set(summary.id, summary);
      
      return summary;
    } catch (error: any) {
      throw new Error(`Failed to connect to ${platformType}: ${error.message}`);
    }
  }
  
  /**
   * Disconnect from a platform
   * @param platformId The platform connection ID
   * @returns True if disconnected successfully
   */
  public async disconnectFromPlatform(platformId: string): Promise<boolean> {
    const connection = this.connections.get(platformId);
    
    if (!connection) {
      throw new Error(`Connection ${platformId} not found`);
    }
    
    const connector = this.connectors.get(connection.platformType);
    
    if (!connector) {
      throw new Error(`Platform type ${connection.platformType} is not supported`);
    }
    
    try {
      // Disconnect from the platform
      const result = await connector.disconnect(platformId);
      
      // Remove the connection from our records
      if (result) {
        this.connections.delete(platformId);
      }
      
      return result;
    } catch (error: any) {
      throw new Error(`Failed to disconnect from ${connection.platformType}: ${error.message}`);
    }
  }
  
  /**
   * Get all platform connections
   * @returns List of platform connections
   */
  public getAllPlatformConnections(): PlatformSummary[] {
    return Array.from(this.connections.values());
  }
  
  /**
   * Get a specific platform connection
   * @param platformId The platform connection ID
   * @returns The platform connection information
   */
  public getPlatformConnection(platformId: string): PlatformSummary {
    const connection = this.connections.get(platformId);
    
    if (!connection) {
      throw new Error(`Connection ${platformId} not found`);
    }
    
    return connection;
  }
  
  /**
   * Fetch items from a platform
   * @param platformId The platform connection ID
   * @param options Options for fetching items
   * @param progressCallback Optional callback for progress updates
   * @returns List of items from the platform
   */
  public async fetchItemsFromPlatform(
    platformId: string, 
    options?: Partial<SyncOptions>,
    progressCallback?: ProgressCallback
  ): Promise<PlatformItem[]> {
    const connection = this.connections.get(platformId);
    
    if (!connection) {
      throw new Error(`Connection ${platformId} not found`);
    }
    
    const connector = this.connectors.get(connection.platformType);
    
    if (!connector) {
      throw new Error(`Platform type ${connection.platformType} is not supported`);
    }
    
    try {
      return await connector.fetchItems(platformId, options, progressCallback);
    } catch (error: any) {
      throw new Error(`Failed to fetch items from ${connection.platformType}: ${error.message}`);
    }
  }
  
  /**
   * Synchronize data with a platform
   * @param platformId The platform connection ID
   * @param options Options for synchronization
   * @param progressCallback Optional callback for progress updates
   * @returns Result of the synchronization operation
   */
  public async syncDataWithPlatform(
    platformId: string, 
    options: SyncOptions,
    progressCallback?: ProgressCallback
  ): Promise<SyncResult> {
    const connection = this.connections.get(platformId);
    
    if (!connection) {
      throw new Error(`Connection ${platformId} not found`);
    }
    
    const connector = this.connectors.get(connection.platformType);
    
    if (!connector) {
      throw new Error(`Platform type ${connection.platformType} is not supported`);
    }
    
    try {
      return await connector.syncData(platformId, options, progressCallback);
    } catch (error: any) {
      throw new Error(`Failed to sync data with ${connection.platformType}: ${error.message}`);
    }
  }
  
  /**
   * Push items to a platform
   * @param platformId The platform connection ID
   * @param items The items to push to the platform
   * @param progressCallback Optional callback for progress updates
   * @returns Result of the push operation
   */
  public async pushItemsToPlatform(
    platformId: string, 
    items: PlatformItem[],
    progressCallback?: ProgressCallback
  ): Promise<SyncResult> {
    const connection = this.connections.get(platformId);
    
    if (!connection) {
      throw new Error(`Connection ${platformId} not found`);
    }
    
    const connector = this.connectors.get(connection.platformType);
    
    if (!connector) {
      throw new Error(`Platform type ${connection.platformType} is not supported`);
    }
    
    try {
      return await connector.pushItems(platformId, items, progressCallback);
    } catch (error: any) {
      throw new Error(`Failed to push items to ${connection.platformType}: ${error.message}`);
    }
  }
  
  /**
   * Import data from a platform to the knowledge base
   * @param platformId The platform connection ID
   * @param options Options for importing data
   * @param progressCallback Optional callback for progress updates
   * @returns Result of the import operation
   */
  public async importPlatformDataToKnowledgeBase(
    platformId: string, 
    options: Partial<SyncOptions>,
    progressCallback?: ProgressCallback
  ): Promise<SyncResult> {
    // First fetch the items from the platform
    const items = await this.fetchItemsFromPlatform(platformId, options, progressCallback);
    
    // TODO: Process items and add them to the knowledge base
    // This would involve transforming the platform-specific items into
    // a format suitable for the knowledge base and then adding them
    
    // For now, just return a mock result
    return {
      success: true,
      platformId,
      itemsProcessed: items.length,
      itemsAdded: items.length,
      itemsUpdated: 0,
      itemsRemoved: 0,
      errors: [],
      timestamp: new Date(),
      duration: 1000
    };
  }
}
