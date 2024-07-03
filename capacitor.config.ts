import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.zennyx.loanreminder',
  appName: 'Loan Reminder',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
