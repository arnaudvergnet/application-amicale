// @flow

import * as React from 'react';
import {Container} from "native-base";
import CustomHeader from "./CustomHeader";
import CustomMaterialIcon from "./CustomMaterialIcon";
import {Platform, StatusBar, View} from "react-native";
import ThemeManager from "../utils/ThemeManager";
import Touchable from "react-native-platform-touchable";
import {ScreenOrientation} from "expo";
import {NavigationActions} from "react-navigation";


type Props = {
    navigation: Object,
    headerTitle: string,
    headerSubtitle: string,
    headerRightButton: React.Node,
    children: React.Node,
    hasTabs: boolean,
    hasBackButton: boolean,
    hasSideMenu: boolean,
    enableRotation: boolean,
    hideHeaderOnLandscape: boolean,
}

type State = {
    isHeaderVisible: boolean
}


export default class BaseContainer extends React.Component<Props, State> {
    static defaultProps = {
        headerRightButton: <View/>,
        hasTabs: false,
        hasBackButton: false,
        hasSideMenu: true,
        enableRotation: false,
        hideHeaderOnLandscape: false,
        headerSubtitle: '',
    };
    willBlurSubscription: function;
    willFocusSubscription: function;
    state = {
        isHeaderVisible: true,
    };

    onDrawerPress: Function;
    onWillFocus: Function;
    onWillBlur: Function;
    onChangeOrientation: Function;

    constructor() {
        super();
        this.onDrawerPress = this.onDrawerPress.bind(this);
        this.onWillFocus = this.onWillFocus.bind(this);
        this.onWillBlur = this.onWillBlur.bind(this);
        this.onChangeOrientation = this.onChangeOrientation.bind(this);
    }

    onDrawerPress() {
        this.props.navigation.toggleDrawer();
    }

    onWillFocus() {
        if (this.props.enableRotation) {
            ScreenOrientation.unlockAsync();
            ScreenOrientation.addOrientationChangeListener(this.onChangeOrientation);
        }
    }

    onWillBlur() {
        if (this.props.enableRotation)
            ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
    }

    onChangeOrientation(OrientationChangeEvent) {
        if (this.props.hideHeaderOnLandscape) {
            let isLandscape = OrientationChangeEvent.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE ||
                OrientationChangeEvent.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                OrientationChangeEvent.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
            this.setState({isHeaderVisible: !isLandscape});
            const setParamsAction = NavigationActions.setParams({
                params: {showTabBar: !isLandscape},
                key: this.props.navigation.state.key,
            });
            this.props.navigation.dispatch(setParamsAction);
            StatusBar.setHidden(isLandscape);
        }
    }

    /**
     * Register for blur event to close side menu on screen change
     */
    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            this.onWillFocus
        );
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            this.onWillBlur
        );
    }

    /**
     * Unregister from event when un-mounting components
     */
    componentWillUnmount() {
        if (this.willBlurSubscription !== undefined)
            this.willBlurSubscription.remove();
        if (this.willFocusSubscription !== undefined)
            this.willFocusSubscription.remove();
    }


    render() {
        // console.log("rendering BaseContainer");
        return (
            <Container>
                {this.state.isHeaderVisible ?
                    <CustomHeader
                        navigation={this.props.navigation}
                        title={this.props.headerTitle}
                        subtitle={this.props.headerSubtitle}
                        leftButton={
                            <Touchable
                                style={{padding: 6}}
                                onPress={this.onDrawerPress}>
                                <CustomMaterialIcon
                                    color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                                    icon="menu"/>
                            </Touchable>
                        }
                        rightButton={this.props.headerRightButton}
                        hasTabs={this.props.hasTabs}
                        hasBackButton={this.props.hasBackButton}/>
                    : <View/>}
                {this.props.children}
            </Container>
        );
    }
}
