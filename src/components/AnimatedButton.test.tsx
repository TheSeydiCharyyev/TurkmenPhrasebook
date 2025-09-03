import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AnimatedButton from './AnimatedButton';

describe('AnimatedButton', () => {
  it('renders with the correct title', () => {
    const { getByText } = render(
      <AnimatedButton title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls the onPress handler when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <AnimatedButton title="Test Button" onPress={onPressMock} />
    );
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <AnimatedButton title="Test Button" onPress={onPressMock} disabled />
    );
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
