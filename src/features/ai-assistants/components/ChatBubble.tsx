/**
 * Chat Bubble Component
 * Displays a single message in the AI assistant chat
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatBubbleProps, MessageRole } from '../types/ai-assistant.types';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLastMessage }) => {
  const isUser = message.role === MessageRole.USER;
  const isSystem = message.role === MessageRole.SYSTEM;

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
        isLastMessage && styles.lastMessage,
      ]}
    >
      {/* Avatar/Icon */}
      {!isUser && (
        <View style={[styles.avatarContainer, styles.aiAvatar]}>
          <Text style={styles.avatarText}>AI</Text>
        </View>
      )}

      {/* Message Bubble */}
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text
          style={[
            styles.text,
            isUser ? styles.userText : styles.assistantText,
          ]}
        >
          {message.content}
        </Text>

        {/* Timestamp */}
        <Text style={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {/* User Avatar */}
      {isUser && (
        <View style={[styles.avatarContainer, styles.userAvatar]}>
          <Text style={styles.avatarText}>You</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  aiAvatar: {
    backgroundColor: '#7C3AED', // Purple like the theme
  },
  assistantBubble: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: scale(4),
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  assistantText: {
    color: '#000000',
  },
  avatarContainer: {
    alignItems: 'center',
    borderRadius: scale(16),
    height: scale(32),
    justifyContent: 'center',
    marginHorizontal: scale(8),
    width: scale(32),
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: moderateScale(11),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bubble: {
    borderRadius: scale(16),
    maxWidth: '70%',
    padding: scale(12),
  },
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginVertical: verticalScale(4),
    paddingHorizontal: scale(16),
  },
  lastMessage: {
    marginBottom: verticalScale(16),
  },
  systemBubble: {
    alignSelf: 'center',
    backgroundColor: '#FFF9E6',
    borderColor: '#FFD700',
    borderWidth: 1,
    maxWidth: '90%',
  },
  systemText: {
    color: '#856404',
    fontStyle: 'italic',
  },
  text: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(4),
  },
  timestamp: {
    alignSelf: 'flex-end',
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: moderateScale(11),
  },
  userAvatar: {
    backgroundColor: '#007AFF', // Blue
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: scale(4),
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  userText: {
    color: '#FFFFFF',
  },
});

export default ChatBubble;
