import { forwardRef } from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { clsx } from 'clsx';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(({ label, error, className, ...props }, ref) => {
  return (
    <View className={clsx('w-full mb-3', className)}>
      {label ? <Text className="text-sm text-gray-700 mb-1">{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor="#9ca3af"
        className="border border-gray-200 rounded-xl px-4 py-3 text-base bg-white"
        {...props}
      />
      {error ? <Text className="text-sm text-red-500 mt-1">{error}</Text> : null}
    </View>
  );
});

Input.displayName = 'Input';
