import { Client, IFrame, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { SocketMessageModel } from "./SocketMessageModel";

class WebSocketService {
  private socketUrl: string;
  private stompClient: Client;
  private subscriptions = new Map<string, any>();
  private pendingSubscriptions: {
    topic: string;
    callback: (message: any) => void;
  }[] = [];

  constructor() {
    this.socketUrl = "http://localhost:1000/ws";

    // Initialize STOMP Client
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.socketUrl), // Use SockJS as WebSocket factory
      reconnectDelay: 5000, // Auto-reconnect after 5 seconds
      onConnect: () => this.onConnected(),
      onStompError: (frame) => this.onStompError(frame),
      onWebSocketClose: () => this.onWebSocketClose(),
      onWebSocketError: (error) => this.onWebSocketError(error),
    });
  }

  // Connect to WebSocket
  connect() {
    console.log("Attempting to connect to WebSocket...");
    this.stompClient.activate();
  }

  // Handle successful connection
  private onConnected() {
    console.log("Connected to WebSocket.");

    // Process pending subscriptions
    this.pendingSubscriptions.forEach(({ topic, callback }) =>
      this.subscribe(topic, callback)
    );
    this.pendingSubscriptions = []; // Clear after processing
  }

  // Handle STOMP errors
  private onStompError(frame: IFrame) {
    console.error("Broker reported error:", frame.headers["message"]);
    console.error("Additional details:", frame.body);
  }

  // Handle WebSocket close
  private onWebSocketClose() {
    console.warn("WebSocket connection closed. Attempting to reconnect...");
  }

  // Handle WebSocket errors
  private onWebSocketError(error: any) {
    console.error("WebSocket error:", error);
  }

  // Send message via STOMP
  sendMessage(destination: string, message: SocketMessageModel) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({ destination, body: JSON.stringify(message) });
    } else {
      console.error("WebSocket is not connected. Message not sent.");
    }
  }

  // Subscribe to a topic
  subscribe(topic: string, callback: (message: SocketMessageModel) => void) {
    if (this.stompClient && this.stompClient.connected) {
      if (!this.subscriptions.has(topic)) {
        const subscription = this.stompClient.subscribe(
          topic,
          (message: IMessage) => {
            if (!message || !message.body) {
              console.error(
                `Invalid message received on topic ${topic}:`,
                message
              );
              return;
            }

            try {
              const parsedMessage = JSON.parse(message.body);

              // Parse content if needed
              if (typeof parsedMessage.content === "string") {
                try {
                  parsedMessage.content = JSON.parse(parsedMessage.content);
                } catch {
                  console.warn(
                    "Content is not valid JSON:",
                    parsedMessage.content
                  );
                }
              }

              callback(parsedMessage);
            } catch (error) {
              console.error(
                `Failed to parse message from topic ${topic}:`,
                error,
                message.body
              );
            }
          }
        );

        this.subscriptions.set(topic, subscription);
        console.log(`Subscribed to topic: ${topic}`);
      }
    } else {
      console.warn(
        `WebSocket not connected. Queuing subscription for: ${topic}`
      );
      this.pendingSubscriptions.push({ topic, callback });
    }
  }

  // Unsubscribe from a topic
  unsubscribe(topic: string) {
    if (this.subscriptions.has(topic)) {
      const subscription = this.subscriptions.get(topic);
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    }
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      console.log("Disconnected from WebSocket.");
    }
  }
}

// Export a singleton instance
export const webSocketService = new WebSocketService();
