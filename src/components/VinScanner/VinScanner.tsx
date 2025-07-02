import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import type { Result } from '@zxing/library';

type Props = {
  onDetected: (vin: string) => void;
};

export default function VinScanner({ onDetected }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<Awaited<ReturnType<BrowserMultiFormatReader['decodeFromVideoDevice']>> | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current!, (result: Result | undefined) => {
        if (result) {
          onDetected(result.getText());
          controlsRef.current?.stop();
        }
      })
      .then((controls) => {
        controlsRef.current = controls;
      })
      .catch((err) => {
        console.error('Camera error:', err);
      });

    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  return <video ref={videoRef} style={{ width: '100%' }} />;
}
