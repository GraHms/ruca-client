import { PropsWithChildren } from 'react';
import { View, ViewProps } from 'react-native';
import { clsx } from 'clsx';

export const Card = ({ children, className, ...props }: PropsWithChildren<ViewProps>) => {
  return (
    <View className={clsx('bg-white rounded-2xl shadow-sm p-4', className)} {...props}>
      {children}
    </View>
  );
};
