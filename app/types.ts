export type LiveData = {
  id: number
  transport: 'IRIDIUM' | 'GPRS' | 'OTHER';
  trigger:
  | 'ROUTINE'
  | 'BURST'
  | 'MANUAL'
  | 'ACTIVATION'
  | 'DEACTIVATION'
  | 'CONFIG_REPORT'
  | 'WAYPOINT'
  | 'MESSAGE'
  | 'ACKNOWLEDGE'
  | 'BLUETOOTH_LOSS'
  | 'COLLISION'
  | 'COUNTDOWN'
  | 'DEAD_MAN'
  | 'GEOFENCE'
  | 'BUTTON'
  | 'CANCEL_ALERT'
  | 'POWER_LOSS'
  | 'POWER_GAIN'
  | 'TEMPERATURE'
  | 'GENERIC'
  | 'BLE_RAW'
  | 'SERIAL_RAW'
  | 'MAILBOX_CHECK'
  | 'APP_MESSAGE'
  | 'WATCHING_START_REQUEST'
  | 'WATCHING_STOP_REQUEST';
  source: 'GPS' | 'IRIDIUM';
  latitude: number;
  longitude: number;
  date: number;
  speed: number;
  course: number;
  altitude: number;
  average_speed: number
  average_course: number;
  temperature: number;
  battery: number;
  plugged_in: boolean;
}