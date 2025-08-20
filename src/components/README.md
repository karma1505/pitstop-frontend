# Custom Alert System

This directory contains the custom alert components and utilities for the PitStop app.

## Components

### CustomAlert.tsx
A customizable alert component that matches the app's design system and color scheme.

**Features:**
- Supports multiple alert types: success, error, warning, info
- Customizable buttons (single OK button or Confirm/Cancel buttons)
- Matches app's theme colors and styling
- Responsive design with proper shadows and animations
- Backdrop dismissal support

**Props:**
```typescript
interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showCancelButton?: boolean;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
}
```

## Hooks

### useCustomAlert
A custom hook that provides easy-to-use methods for showing different types of alerts.

**Methods:**
- `showSuccessAlert(title, message, onConfirm?)`
- `showErrorAlert(title, message, onConfirm?)`
- `showWarningAlert(title, message, onConfirm?)`
- `showInfoAlert(title, message, onConfirm?)`
- `showConfirmAlert(title, message, onConfirm, onCancel, confirmText?, cancelText?)`

## Usage Examples

### Basic Usage
```typescript
import { useCustomAlert } from '../hooks';
import CustomAlert from '../components/CustomAlert';

const MyComponent = () => {
  const { alertConfig, isVisible, showSuccessAlert } = useCustomAlert();

  const handleSuccess = () => {
    showSuccessAlert('Success!', 'Operation completed successfully.');
  };

  return (
    <View>
      <Button onPress={handleSuccess} title="Show Success" />
      
      {alertConfig && (
        <CustomAlert
          visible={isVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          showCancelButton={alertConfig.showCancelButton}
          cancelText={alertConfig.cancelText}
          confirmText={alertConfig.confirmText}
          onConfirm={alertConfig.onConfirm}
          onCancel={alertConfig.onCancel}
          onDismiss={() => {}}
        />
      )}
    </View>
  );
};
```

### Confirmation Dialog
```typescript
const handleDelete = () => {
  showConfirmAlert(
    'Delete Item',
    'Are you sure you want to delete this item?',
    () => {
      // User confirmed - perform delete action
      deleteItem();
    },
    () => {
      // User cancelled - do nothing
      console.log('Delete cancelled');
    },
    'Delete',
    'Cancel'
  );
};
```

### Error Handling
```typescript
const handleApiCall = async () => {
  try {
    await apiCall();
    showSuccessAlert('Success', 'Data saved successfully!');
  } catch (error) {
    showErrorAlert('Error', 'Failed to save data. Please try again.');
  }
};
```

## Alert Types and Colors

The custom alert automatically uses the appropriate colors from your theme:

- **Success**: Green background with checkmark icon
- **Error**: Red background with close icon  
- **Warning**: Yellow background with warning icon
- **Info**: Blue background with information icon

## Migration from Default Alert

Replace React Native's default `Alert.alert()` with the custom alert system:

**Before:**
```typescript
import { Alert } from 'react-native';

Alert.alert('Title', 'Message', [
  { text: 'Cancel', style: 'cancel' },
  { text: 'OK', onPress: () => console.log('OK Pressed') }
]);
```

**After:**
```typescript
import { useCustomAlert } from '../hooks';

const { showConfirmAlert } = useCustomAlert();

showConfirmAlert(
  'Title',
  'Message',
  () => console.log('OK Pressed'),
  () => console.log('Cancel Pressed'),
  'OK',
  'Cancel'
);
```

## Benefits

1. **Consistent Design**: Matches your app's color scheme and styling
2. **Better UX**: More visually appealing than default system alerts
3. **Theme Support**: Automatically adapts to light/dark themes
4. **Customizable**: Easy to modify appearance and behavior
5. **Type Safety**: Full TypeScript support with proper interfaces
6. **Reusable**: Can be used throughout the entire app
