import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface AddressDropdownProps {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  disableSearch?: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

const AddressDropdown: React.FC<AddressDropdownProps> = ({
  label,
  value,
  placeholder,
  options,
  onSelect,
  error,
  required = false,
  disabled = false,
  disableSearch = false,
}) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchQuery, options]);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchQuery('');
      if (!isOpen) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
        {required && <Text style={[styles.required, { color: colors.error }]}> *</Text>}
      </Text>
      
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={[
            styles.inputContainer,
            { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder },
            error && { borderColor: colors.error },
            disabled && { backgroundColor: colors.surface, borderColor: colors.outline },
          ]}
          onPress={handleOpen}
          disabled={disabled}
        >
          <Text
            style={[
              styles.inputText,
              { color: colors.inputText },
              !value && { color: colors.inputPlaceholder },
              disabled && { color: colors.textTertiary },
            ]}
          >
            {value || placeholder}
          </Text>
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.dropdownList}>
            {!disableSearch && (
              <TextInput
                ref={inputRef}
                style={[styles.searchInput, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.inputText }]}
                placeholder={`Search ${label.toLowerCase()}...`}
                placeholderTextColor={colors.inputPlaceholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            )}

            <ScrollView
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {filteredOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionItem, { backgroundColor: colors.surface }]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flex: 1, // Allow it to take the full width of parent
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    // Color applied dynamically
  },
  dropdownContainer: {
    position: 'relative',
    flex: 1, // Allow it to take the full width of parent
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16, // Match the exact padding of other text inputs
    minHeight: 52, // Match the height of other text inputs
  },
  inputError: {
    // Color applied dynamically
  },
  inputDisabled: {
    // Colors applied dynamically
  },
  inputText: {
    flex: 1,
    fontSize: 16,
  },
  placeholder: {
    // Color applied dynamically
  },
  textDisabled: {
    // Color applied dynamically
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    fontSize: 16,
    backgroundColor: '#333',
    color: '#fff',
  },
  optionsList: {
    maxHeight: 150,
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  optionText: {
    fontSize: 16,
    color: '#fff', // White text in dropdown
  },
});

export default AddressDropdown; 