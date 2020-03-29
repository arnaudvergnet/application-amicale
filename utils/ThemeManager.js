// @flow

import AsyncStorageManager from "./AsyncStorageManager";
import {DarkTheme, DefaultTheme} from 'react-native-paper';
import AprilFoolsManager from "./AprilFoolsManager";
import {Appearance} from 'react-native-appearance';

const colorScheme = Appearance.getColorScheme();

/**
 * Singleton class used to manage themes
 */
export default class ThemeManager {

    static instance: ThemeManager | null = null;
    updateThemeCallback: Function;

    constructor() {
        this.updateThemeCallback = null;
    }

    /**
     * Gets the light theme
     *
     * @return {Object} Object containing theme variables
     * */
    static getWhiteTheme(): Object {
        return {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                primary: '#be1522',
                accent: '#be1522',
                tabIcon: "#929292",
                card: "rgb(255, 255, 255)",
                dividerBackground: '#e2e2e2',
                textDisabled: '#c1c1c1',
                icon: '#5d5d5d',
                subtitle: '#707070',
                success: "#5cb85c",
                warning: "#f0ad4e",
                danger: "#d9534f",

                // Calendar/Agenda
                agendaBackgroundColor: '#f3f3f4',
                agendaDayTextColor: '#636363',

                // PROXIWASH
                proxiwashFinishedColor: "#a5dc9d",
                proxiwashReadyColor: "transparent",
                proxiwashRunningColor: "#a0ceff",
                proxiwashRunningBgColor: "#c7e3ff",
                proxiwashBrokenColor: "#8e8e8e",
                proxiwashErrorColor: "rgba(204,7,0,0.31)#e35f57",

                // Screens
                planningColor: '#d9b10a',
                proximoColor: '#ec5904',
                proxiwashColor: '#1fa5ee',
                menuColor: '#e91314',
                tutorinsaColor: '#f93943',

                // Tetris
                tetrisBackground:'#e6e6e6',
                tetrisBorder:'#2f2f2f',
                tetrisScore:'#e2bd33',
                tetrisI : '#3cd9e6',
                tetrisO : '#ffdd00',
                tetrisT : '#a716e5',
                tetrisS : '#09c528',
                tetrisZ : '#ff0009',
                tetrisJ : '#2a67e3',
                tetrisL : '#da742d',
            },
        };
    }

    /**
     * Gets the dark theme
     *
     * @return {Object} Object containing theme variables
     * */
    static getDarkTheme(): Object {
        return {
            ...DarkTheme,
            colors: {
                ...DarkTheme.colors,
                primary: '#be1522',
                accent: '#be1522',
                tabBackground: "#181818",
                tabIcon: "#6d6d6d",
                card: "rgb(18, 18, 18)",
                dividerBackground: '#222222',
                textDisabled: '#5b5b5b',
                icon: '#b3b3b3',
                subtitle: '#aaaaaa',
                success: "#5cb85c",
                warning: "#f0ad4e",
                danger: "#d9534f",

                // Calendar/Agenda
                agendaBackgroundColor: '#171717',
                agendaDayTextColor: '#6d6d6d',

                // PROXIWASH
                proxiwashFinishedColor: "#31682c",
                proxiwashReadyColor: "transparent",
                proxiwashRunningColor: "#213c79",
                proxiwashRunningBgColor: "#1a2033",
                proxiwashBrokenColor: "#656565",
                proxiwashErrorColor: "#7e2e2f",

                // Screens
                planningColor: '#d99e09',
                proximoColor: '#ec5904',
                proxiwashColor: '#1fa5ee',
                menuColor: '#b81213',
                tutorinsaColor: '#f93943',

                // Tetris
                tetrisBackground:'#2c2c2c',
                tetrisBorder:'#1b1b1b',
                tetrisScore:'#e2d707',
                tetrisI : '#30b3be',
                tetrisO : '#c1a700',
                tetrisT : '#9114c7',
                tetrisS : '#08a121',
                tetrisZ : '#b50008',
                tetrisJ : '#0f37b9',
                tetrisL : '#b96226',
            },
        };
    }

    /**
     * Get this class instance or create one if none is found
     *
     * @returns {ThemeManager}
     */
    static getInstance(): ThemeManager {
        return ThemeManager.instance === null ?
            ThemeManager.instance = new ThemeManager() :
            ThemeManager.instance;
    }

    /**
     * Gets night mode status.
     * If Follow System Preferences is enabled, will first use system theme.
     * If disabled or not available, will use value stored din preferences
     *
     * @returns {boolean} Night mode state
     */
    static getNightMode(): boolean {
        return (AsyncStorageManager.getInstance().preferences.nightMode.current === '1' &&
            (AsyncStorageManager.getInstance().preferences.nightModeFollowSystem.current !== '1' ||
                colorScheme === 'no-preference')) ||
            (AsyncStorageManager.getInstance().preferences.nightModeFollowSystem.current === '1' && colorScheme === 'dark');
    }

    /**
     * Get the current theme based on night mode and events
     *
     * @returns {Object} The current theme
     */
    static getCurrentTheme(): Object {
        if (AprilFoolsManager.getInstance().isAprilFoolsEnabled())
            return AprilFoolsManager.getAprilFoolsTheme(ThemeManager.getWhiteTheme());
        else
            return ThemeManager.getBaseTheme()
    }

    /**
     * Get the theme based on night mode
     *
     * @return {Object} The theme
     */
    static getBaseTheme() {
        if (ThemeManager.getNightMode())
            return ThemeManager.getDarkTheme();
        else
            return ThemeManager.getWhiteTheme();
    }

    /**
     * Sets the function to be called when the theme is changed (allows for general reload of the app)
     *
     * @param callback Function to call after theme change
     */
    setUpdateThemeCallback(callback: ?Function) {
        this.updateThemeCallback = callback;
    }

    /**
     * Set night mode and save it to preferences
     *
     * @param isNightMode True to enable night mode, false to disable
     */
    setNightMode(isNightMode: boolean) {
        let nightModeKey = AsyncStorageManager.getInstance().preferences.nightMode.key;
        AsyncStorageManager.getInstance().savePref(nightModeKey, isNightMode ? '1' : '0');
        if (this.updateThemeCallback !== null)
            this.updateThemeCallback();
    }

};
