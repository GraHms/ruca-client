import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuthStore } from '@/state/useAuthStore';
import { showToast } from '@/utils/toast';

const MOCK_CODE = '123456';

export const AuthScreen = () => {
  const { t } = useTranslation();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const [identifier, setIdentifier] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');

  const handleRequestCode = () => {
    if (!identifier) {
      showToast(t('common.error'));
      return;
    }
    setCode(MOCK_CODE);
    setCodeSent(true);
    showToast(`Código enviado: ${MOCK_CODE}`);
  };

  const handleLogin = async () => {
    if (code !== MOCK_CODE) {
      showToast(t('common.error'));
      return;
    }
    await login(identifier, code);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-primary mb-2">{t('auth.title')}</Text>
        <Text className="text-base text-gray-500 mb-8">{t('auth.subtitle')}</Text>
        <Input
          label={t('auth.identifierLabel')}
          placeholder={t('auth.identifierPlaceholder')}
          value={identifier}
          onChangeText={setIdentifier}
          keyboardType="phone-pad"
        />
        {codeSent ? (
          <Input
            label={t('auth.codeLabel')}
            placeholder={t('auth.codePlaceholder')}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
          />
        ) : null}
        {!codeSent ? (
          <Button className="mt-4" onPress={handleRequestCode} loading={loading}>
            {t('auth.requestCode')}
          </Button>
        ) : (
          <Button className="mt-4" onPress={handleLogin} loading={loading}>
            {t('auth.login')}
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
