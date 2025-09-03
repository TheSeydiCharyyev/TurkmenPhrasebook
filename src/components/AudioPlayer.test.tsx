import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AudioPlayer from './AudioPlayer';
import { LanguageProvider, createConfig } from '../contexts/LanguageContext';
import * as Speech from 'expo-speech';

const AllTheProviders = ({ children, lang }) => {
  const config = createConfig(lang || 'tk');
  return <LanguageProvider initialConfig={config}>{children}</LanguageProvider>;
};

const customRender = (ui, options) =>
  render(ui, { wrapper: (props) => <AllTheProviders {...props} {...options} />, ...options });

describe('AudioPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with the correct label', () => {
    const { getByText } = customRender(
      <AudioPlayer text="Test" language="chinese" label="Play Audio" style="primary" />
    );
    expect(getByText('Play Audio')).toBeTruthy();
  });

  it('calls the Speech.speak function when pressed', async () => {
    const { getByText } = customRender(
      <AudioPlayer text="Test" language="chinese" label="Play Audio" style="primary" />
    );
    await act(async () => {
      fireEvent.press(getByText('Play Audio'));
    });
    expect(Speech.speak).toHaveBeenCalledWith('Test', expect.any(Object));
  });

  it('calls the Speech.stop function when pressed while playing', async () => {
    const { getByText, rerender } = customRender(
      <AudioPlayer text="Test" language="chinese" label="Play Audio" style="primary" />
    );

    await act(async () => {
      fireEvent.press(getByText('Play Audio'));
    });

    rerender(<AudioPlayer text="Test" language="chinese" label="Play Audio" style="primary" />);

    await act(async () => {
      fireEvent.press(getByText('Play Audio'));
    });

    expect(Speech.stop).toHaveBeenCalledTimes(1);
  });

  it('calls the Speech.stop function on unmount if playing', async () => {
    const { getByText, unmount } = customRender(
      <AudioPlayer text="Test" language="chinese" label="Play Audio" style="primary" />
    );

    await act(async () => {
      fireEvent.press(getByText('Play Audio'));
    });

    unmount();
    expect(Speech.stop).toHaveBeenCalledTimes(1);
  });
});