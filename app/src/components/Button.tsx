import { PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';
import { clsx } from 'clsx';

interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  loading,
  className,
  disabled,
  ...rest
}: PropsWithChildren<ButtonProps>) => {
  const baseStyles = 'px-4 py-3 rounded-xl flex-row items-center justify-center';
  const variantStyles = {
    primary: 'bg-primary text-white',
    secondary: 'bg-white border border-primary text-primary',
    ghost: 'bg-transparent text-primary'
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      className={clsx(baseStyles, variantStyles, disabled && 'opacity-50', className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : '#0f766e'} />
      ) : (
        <Text
          className={clsx(
            'font-semibold text-base',
            variant === 'primary' ? 'text-white' : 'text-primary'
          )}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};
