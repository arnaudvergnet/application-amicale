// @flow

import * as React from 'react';
import WebView from "react-native-webview";
import BasicLoadingScreen from "../Custom/BasicLoadingScreen";
import ErrorView from "../Custom/ErrorView";
import {ERROR_TYPE} from "../../utils/WebData";
import MaterialHeaderButtons, {Item} from '../Custom/HeaderButton';
import {HiddenItem} from "react-navigation-header-buttons";
import {Linking} from "expo";
import i18n from 'i18n-js';
import {Animated, BackHandler, Platform, StatusBar} from "react-native";
import {withCollapsible} from "../../utils/withCollapsible";

type Props = {
    navigation: Object,
    url: string,
    customJS: string,
    collapsibleStack: Object,
    onMessage: Function,
    onScroll: Function,
}

const AnimatedWebView = Animated.createAnimatedComponent(WebView);

/**
 * Class defining a webview screen.
 */
class WebViewScreen extends React.PureComponent<Props> {

    static defaultProps = {
        customJS: '',
    };

    webviewRef: Object;

    canGoBack: boolean;

    constructor() {
        super();
        this.webviewRef = React.createRef();
        this.canGoBack = false;
    }

    /**
     * Creates refresh button after mounting
     */
    componentDidMount() {
        const rightButton = this.getRefreshButton.bind(this);
        this.props.navigation.setOptions({
            headerRight: rightButton,
        });
        this.props.navigation.addListener(
            'focus',
            () =>
                BackHandler.addEventListener(
                    'hardwareBackPress',
                    this.onBackButtonPressAndroid
                )
        );
        this.props.navigation.addListener(
            'blur',
            () =>
                BackHandler.removeEventListener(
                    'hardwareBackPress',
                    this.onBackButtonPressAndroid
                )
        );
    }

    onBackButtonPressAndroid = () => {
        if (this.canGoBack) {
            this.onGoBackClicked();
            return true;
        }
        return false;
    };

    /**
     * Gets a header refresh button
     *
     * @return {*}
     */
    getRefreshButton() {
        return (
            <MaterialHeaderButtons>
                <Item
                    title="refresh"
                    iconName="refresh"
                    onPress={this.onRefreshClicked}/>
                <HiddenItem
                    title={i18n.t("general.goBack")}
                    iconName="arrow-left"
                    onPress={this.onGoBackClicked}/>
                <HiddenItem
                    title={i18n.t("general.goForward")}
                    iconName="arrow-right"
                    onPress={this.onGoForwardClicked}/>
                <HiddenItem
                    title={i18n.t("general.openInBrowser")}
                    iconName="web"
                    onPress={this.onOpenClicked}/>
            </MaterialHeaderButtons>
        );
    };

    /**
     * Callback to use when refresh button is clicked. Reloads the webview.
     */
    onRefreshClicked = () => this.webviewRef.current.getNode().reload(); // Need to call getNode() as we are working with animated components
    onGoBackClicked = () => this.webviewRef.current.getNode().goBack();
    onGoForwardClicked = () => this.webviewRef.current.getNode().goForward();

    onOpenClicked = () => Linking.openURL(this.props.url);

    injectJavaScript = (script: string) => {
        this.webviewRef.current.getNode().injectJavaScript(script);
    }

    /**
     * Gets the loading indicator
     *
     * @return {*}
     */
    getRenderLoading = () => <BasicLoadingScreen isAbsolute={true}/>;

    getJavascriptPadding(padding: number) {
        return (
            "document.getElementsByTagName('body')[0].style.paddingTop = '" + padding + "px';" +
            "true;"
        );
    }

    render() {
        const {containerPaddingTop, onScrollWithListener} = this.props.collapsibleStack;
        const padding = Platform.OS === 'android'  // Fix for android non translucent bar on expo
            ? containerPaddingTop - StatusBar.currentHeight
            : containerPaddingTop;
        return (
            <AnimatedWebView
                ref={this.webviewRef}
                source={{uri: this.props.url}}
                startInLoadingState={true}
                injectedJavaScript={this.props.customJS}
                javaScriptEnabled={true}
                renderLoading={this.getRenderLoading}
                renderError={() => <ErrorView
                    errorCode={ERROR_TYPE.CONNECTION_ERROR}
                    onRefresh={this.onRefreshClicked}
                />}
                onNavigationStateChange={navState => {
                    this.canGoBack = navState.canGoBack;
                }}
                onMessage={this.props.onMessage}
                onLoad={() => this.injectJavaScript(this.getJavascriptPadding(padding))}
                // Animations
                onScroll={onScrollWithListener(this.props.onScroll)}
            />
        );
    }
}

export default withCollapsible(WebViewScreen);
