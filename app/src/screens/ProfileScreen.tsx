import { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { RootStackParamList } from '@/navigation';
import { useAuthStore } from '@/state/useAuthStore';

export const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t, i18n } = useTranslation();
  const session = useAuthStore((state) => state.session);
  const logout = useAuthStore((state) => state.logout);
  const updateLanguage = useAuthStore((state) => state.updateLanguage);
  const [driverMode, setDriverMode] = useState(false);

  const handleLanguage = async (language: 'pt' | 'en') => {
    updateLanguage(language);
    await i18n.changeLanguage(language);
  };

  const handleDriverMode = (value: boolean) => {
    setDriverMode(value);
    if (value) {
      navigation.navigate('DriverMode');
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16 }}>
      <View className="bg-white rounded-2xl p-4 mb-4">
        <Text className="text-xs text-gray-400">{t('profile.name')}</Text>
        <Text className="text-lg font-semibold text-gray-800">{session?.user.name}</Text>
        <Text className="text-xs text-gray-400 mt-3">{t('profile.phone')}</Text>
        <Text className="text-lg text-gray-800">{session?.user.phone}</Text>
      </View>

      <View className="bg-white rounded-2xl p-4 mb-4">
        <Text className="text-base font-semibold text-gray-800 mb-2">{t('profile.language')}</Text>
        <View className="flex-row justify-between">
          <Button
            className="flex-1 mr-2"
            variant={session?.user.language === 'pt' ? 'primary' : 'secondary'}
            onPress={() => handleLanguage('pt')}
          >
            Português
          </Button>
          <Button
            className="flex-1 ml-2"
            variant={session?.user.language === 'en' ? 'primary' : 'secondary'}
            onPress={() => handleLanguage('en')}
          >
            English
          </Button>
        </View>
      </View>

      <View className="bg-white rounded-2xl p-4 mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-base font-semibold text-gray-800">{t('profile.driverMode')}</Text>
          <Text className="text-sm text-gray-500">Experimente o modo motorista</Text>
        </View>
        <Switch value={driverMode} onValueChange={handleDriverMode} trackColor={{ true: '#0f766e' }} />
      </View>

      <Button variant="secondary" onPress={logout}>
        {t('profile.logout')}
      </Button>
    </ScrollView>
  );
};
