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
  container: {
    flexDirection: 'row',
    marginVertical: verticalScale(4),
    paddingHorizontal: scale(16),
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  lastMessage: {
    marginBottom: verticalScale(16),
  },
  avatarContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(8),
  },
  aiAvatar: {
    backgroundColor: '#7C3AED', // Purple like the theme
  },
  userAvatar: {
    backgroundColor: '#007AFF', // Blue
  },
  avatarText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bubble: {
    maxWidth: '70%',
    padding: scale(12),
    borderRadius: scale(16),
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: scale(4),
  },
  assistantBubble: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: scale(4),
  },
  systemBubble: {
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFD700',
    maxWidth: '90%',
    alignSelf: 'center',
  },
  text: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(4),
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#000000',
  },
  systemText: {
    color: '#856404',
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: moderateScale(11),
    color: 'rgba(0, 0, 0, 0.4)',
    alignSelf: 'flex-end',
  },
});

export default ChatBubble;
