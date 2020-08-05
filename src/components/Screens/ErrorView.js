// @flow

import * as React from 'react';
import {Button, Subheading, withTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from 'i18n-js';
import * as Animatable from 'react-native-animatable';
import {StackNavigationProp} from '@react-navigation/stack';
import {ERROR_TYPE} from '../../utils/WebData';
import type {CustomThemeType} from '../../managers/ThemeManager';

type PropsType = {
  navigation: StackNavigationProp,
  theme: CustomThemeType,
  route: {name: string},
  onRefresh?: () => void,
  errorCode?: number,
  icon?: string,
  message?: string,
  showRetryButton?: boolean,
};

const styles = StyleSheet.create({
  outer: {
    height: '100%',
  },
  inner: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  iconContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  subheading: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

class ErrorView extends React.PureComponent<PropsType> {
  static defaultProps = {
    onRefresh: () => {},
    errorCode: 0,
    icon: '',
    message: '',
    showRetryButton: true,
  };

  message: string;

  icon: string;

  showLoginButton: boolean;

  constructor(props: PropsType) {
    super(props);
    this.icon = '';
  }

  getRetryButton(): React.Node {
    const {props} = this;
    return (
      <Button
        mode="contained"
        icon="refresh"
        onPress={props.onRefresh}
        style={styles.button}>
        {i18n.t('general.retry')}
      </Button>
    );
  }

  getLoginButton(): React.Node {
    return (
      <Button
        mode="contained"
        icon="login"
        onPress={this.goToLogin}
        style={styles.button}>
        {i18n.t('screens.login.title')}
      </Button>
    );
  }

  goToLogin = () => {
    const {props} = this;
    props.navigation.navigate('login', {
      screen: 'login',
      params: {nextScreen: props.route.name},
    });
  };

  generateMessage() {
    const {props} = this;
    this.showLoginButton = false;
    if (props.errorCode !== 0) {
      switch (props.errorCode) {
        case ERROR_TYPE.BAD_CREDENTIALS:
          this.message = i18n.t('errors.badCredentials');
          this.icon = 'account-alert-outline';
          break;
        case ERROR_TYPE.BAD_TOKEN:
          this.message = i18n.t('errors.badToken');
          this.icon = 'account-alert-outline';
          this.showLoginButton = true;
          break;
        case ERROR_TYPE.NO_CONSENT:
          this.message = i18n.t('errors.noConsent');
          this.icon = 'account-remove-outline';
          break;
        case ERROR_TYPE.TOKEN_SAVE:
          this.message = i18n.t('errors.tokenSave');
          this.icon = 'alert-circle-outline';
          break;
        case ERROR_TYPE.BAD_INPUT:
          this.message = i18n.t('errors.badInput');
          this.icon = 'alert-circle-outline';
          break;
        case ERROR_TYPE.FORBIDDEN:
          this.message = i18n.t('errors.forbidden');
          this.icon = 'lock';
          break;
        case ERROR_TYPE.CONNECTION_ERROR:
          this.message = i18n.t('errors.connectionError');
          this.icon = 'access-point-network-off';
          break;
        case ERROR_TYPE.SERVER_ERROR:
          this.message = i18n.t('errors.serverError');
          this.icon = 'server-network-off';
          break;
        default:
          this.message = i18n.t('errors.unknown');
          this.icon = 'alert-circle-outline';
          break;
      }
      this.message += `\n\nCode ${
        props.errorCode != null ? props.errorCode : -1
      }`;
    } else {
      this.message = props.message != null ? props.message : '';
      this.icon = props.icon != null ? props.icon : '';
    }
  }

  render(): React.Node {
    const {props} = this;
    this.generateMessage();
    let button;
    if (this.showLoginButton) button = this.getLoginButton();
    else if (props.showRetryButton) button = this.getRetryButton();
    else button = null;

    return (
      <Animatable.View
        style={{
          ...styles.outer,
          backgroundColor: props.theme.colors.background,
        }}
        animation="zoomIn"
        duration={200}
        useNativeDriver>
        <View style={styles.inner}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              // $FlowFixMe
              name={this.icon}
              size={150}
              color={props.theme.colors.textDisabled}
            />
          </View>
          <Subheading
            style={{
              ...styles.subheading,
              color: props.theme.colors.textDisabled,
            }}>
            {this.message}
          </Subheading>
          {button}
        </View>
      </Animatable.View>
    );
  }
}

export default withTheme(ErrorView);
