// @flow

import * as React from 'react';
import {
    Body,
    Card,
    CardItem,
    CheckBox,
    Container,
    Content,
    Left,
    List,
    ListItem,
    Picker,
    Right,
    Text,
} from "native-base";
import CustomHeader from "../components/CustomHeader";
import ThemeManager from '../utils/ThemeManager';
import i18n from "i18n-js";
import {NavigationActions, StackActions} from "react-navigation";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import AsyncStorageManager from "../utils/AsyncStorageManager";
import Touchable from "react-native-platform-touchable";
import {Platform} from "react-native";

type Props = {
    navigation: Object,
};

type State = {
    nightMode: boolean,
    proxiwashNotifPickerSelected: string,
};

/**
 * Class defining the Settings screen. This screen shows controls to modify app preferences.
 */
export default class SettingsScreen extends React.Component<Props, State> {
    state = {
        nightMode: ThemeManager.getNightMode(),
        proxiwashNotifPickerSelected: AsyncStorageManager.getInstance().preferences.proxiwashNotifications.current,
    };

    /**
     * Save the value for the proxiwash reminder notification time
     *
     * @param value The value to store
     */
    onProxiwashNotifPickerValueChange(value: string) {
        let key = AsyncStorageManager.getInstance().preferences.proxiwashNotifications.key;
        AsyncStorageManager.getInstance().savePref(key, value);
        this.setState({
            proxiwashNotifPickerSelected: value
        });
    }

    /**
     * Returns a picker allowing the user to select the proxiwash reminder notification time
     *
     * @returns {React.Node}
     */
    getProxiwashNotifPicker() {
        return (
            <Picker
                note
                mode="dropdown"
                style={{width: 120}}
                selectedValue={this.state.proxiwashNotifPickerSelected}
                onValueChange={(value) => this.onProxiwashNotifPickerValueChange(value)}
            >
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.never')} value="never"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.1')} value="1"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.2')} value="2"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.3')} value="3"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.5')} value="5"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.10')} value="10"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.20')} value="20"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.30')} value="30"/>
            </Picker>
        );
    }

    /**
     * Toggle night mode and save it to preferences
     */
    toggleNightMode() {
        ThemeManager.getInstance().setNightMode(!this.state.nightMode);
        this.setState({nightMode: !this.state.nightMode});
        // Alert.alert(i18n.t('settingsScreen.nightMode'), i18n.t('settingsScreen.restart'));
        this.resetStack();
    }

    /**
     * Reset react navigation stack to allow for a theme reset
     */
    resetStack() {
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({routeName: 'Main'})],
        });
        this.props.navigation.dispatch(resetAction);
        // this.props.navigation.navigate('SettingsScreen');
    }

    /**
     * Get a list item using a checkbox control
     *
     * @param onPressCallback The callback when the checkbox state changes
     * @param icon The icon name to display on the list item
     * @param title The text to display as this list item title
     * @param subtitle The text to display as this list item subtitle
     * @returns {React.Node}
     */
    getToggleItem(onPressCallback: Function, icon: string, title: string, subtitle: string) {
        return (
            <ListItem
                button
                thumbnail
                onPress={onPressCallback}
            >
                <Left>
                    <CustomMaterialIcon icon={icon}/>
                </Left>
                <Body>
                    <Text>
                        {title}
                    </Text>
                    <Text note>
                        {subtitle}
                    </Text>
                </Body>
                <Right style={{flex: 1}}>
                    <CheckBox checked={this.state.nightMode}
                              onPress={() => this.toggleNightMode()}/>
                </Right>
            </ListItem>
        );
    }

    /**
     * Get a list item using the specified control
     *
     * @param control The custom control to use
     * @param icon The icon name to display on the list item
     * @param title The text to display as this list item title
     * @param subtitle The text to display as this list item subtitle
     * @returns {React.Node}
     */
    static getGeneralItem(control: React.Node, icon: string, title: string, subtitle: string) {
        return (
            <ListItem
                thumbnail
            >
                <Left>
                    <CustomMaterialIcon icon={icon}/>
                </Left>
                <Body>
                    <Text>
                        {title}
                    </Text>
                    <Text note>
                        {subtitle}
                    </Text>
                </Body>

                <Right style={{flex: 1}}>
                    {control}
                </Right>
            </ListItem>
        );
    }

    getRightButton() {
        return (
            <Touchable
                style={{padding: 6}}
                onPress={() => this.props.navigation.navigate('AboutScreen')}>
                <CustomMaterialIcon
                    color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                    icon="information"/>
            </Touchable>
        );
    }

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.settings')} hasBackButton={true}
                rightButton={this.getRightButton()}/>
                <Content padder>
                    <Card>
                        <CardItem header>
                            <Text>{i18n.t('settingsScreen.appearanceCard')}</Text>
                        </CardItem>
                        <List>
                            {this.getToggleItem(() => this.toggleNightMode(), 'theme-light-dark', i18n.t('settingsScreen.nightMode'), i18n.t('settingsScreen.nightModeSub'))}
                        </List>
                    </Card>
                    <Card>
                        <CardItem header>
                            <Text>Proxiwash</Text>
                        </CardItem>
                        <List>
                            {SettingsScreen.getGeneralItem(this.getProxiwashNotifPicker(), 'washing-machine', i18n.t('settingsScreen.proxiwashNotifReminder'), i18n.t('settingsScreen.proxiwashNotifReminderSub'))}
                        </List>
                    </Card>
                </Content>
            </Container>

        );
    }
}
