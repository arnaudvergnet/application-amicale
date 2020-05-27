// @flow

import * as React from 'react';
import {Platform} from "react-native";
import i18n from "i18n-js";
import {Searchbar} from "react-native-paper";
import {stringMatchQuery} from "../../utils/Search";
import WebSectionList from "../../components/Screens/WebSectionList";
import GroupListAccordion from "../../components/Lists/PlanexGroups/GroupListAccordion";
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import {StackNavigationProp} from "@react-navigation/stack";

const LIST_ITEM_HEIGHT = 70;

export type group = {
    name: string,
    id: number,
    isFav: boolean,
};

export type groupCategory = {
    name: string,
    id: number,
    content: Array<group>,
};

type Props = {
    navigation: StackNavigationProp,
}

type State = {
    currentSearchString: string,
    favoriteGroups: Array<group>,
};

function sortName(a: group | groupCategory, b: group | groupCategory) {
    if (a.name.toLowerCase() < b.name.toLowerCase())
        return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase())
        return 1;
    return 0;
}

const GROUPS_URL = 'http://planex.insa-toulouse.fr/wsAdeGrp.php?projectId=1';
const REPLACE_REGEX = /_/g;

/**
 * Class defining proximo's article list of a certain category.
 */
class GroupSelectionScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            currentSearchString: '',
            favoriteGroups: JSON.parse(AsyncStorageManager.getInstance().preferences.planexFavoriteGroups.current),
        };
    }

    /**
     * Creates the header content
     */
    componentDidMount() {
        this.props.navigation.setOptions({
            headerTitle: this.getSearchBar,
            headerBackTitleVisible: false,
            headerTitleContainerStyle: Platform.OS === 'ios' ?
                {marginHorizontal: 0, width: '70%'} :
                {marginHorizontal: 0, right: 50, left: 50},
        });
    }

    /**
     * Gets the header search bar
     *
     * @return {*}
     */
    getSearchBar = () => {
        return (
            <Searchbar
                placeholder={i18n.t('proximoScreen.search')}
                onChangeText={this.onSearchStringChange}
            />
        );
    };

    /**
     * Callback used when the search changes
     *
     * @param str The new search string
     */
    onSearchStringChange = (str: string) => {
        this.setState({currentSearchString: str})
    };

    /**
     * Callback used when clicking an article in the list.
     * It opens the modal to show detailed information about the article
     *
     * @param item The article pressed
     */
    onListItemPress = (item: group) => {
        this.props.navigation.navigate("planex", {
            screen: "index",
            params: {group: item}
        });
    };

    onListFavoritePress = (item: group) => {
        this.updateGroupFavorites(item);
    };

    isGroupInFavorites(group: group) {
        let isFav = false;
        for (let i = 0; i < this.state.favoriteGroups.length; i++) {
            if (group.id === this.state.favoriteGroups[i].id) {
                isFav = true;
                break;
            }
        }
        return isFav;
    }

    removeGroupFromFavorites(favorites: Array<group>, group: group) {
        for (let i = 0; i < favorites.length; i++) {
            if (group.id === favorites[i].id) {
                favorites.splice(i, 1);
                break;
            }
        }
    }

    addGroupToFavorites(favorites: Array<group>, group: group) {
        group.isFav = true;
        favorites.push(group);
        favorites.sort(sortName);
    }

    updateGroupFavorites(group: group) {
        let newFavorites = [...this.state.favoriteGroups]
        if (this.isGroupInFavorites(group))
            this.removeGroupFromFavorites(newFavorites, group);
        else
            this.addGroupToFavorites(newFavorites, group);
        this.setState({favoriteGroups: newFavorites})
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.planexFavoriteGroups.key,
            JSON.stringify(newFavorites));
    }

    shouldDisplayAccordion(item: groupCategory) {
        let shouldDisplay = false;
        for (let i = 0; i < item.content.length; i++) {
            if (stringMatchQuery(item.content[i].name, this.state.currentSearchString)) {
                shouldDisplay = true;
                break;
            }
        }
        return shouldDisplay;
    }

    /**
     * Gets a render item for the given article
     *
     * @param item The article to render
     * @return {*}
     */
    renderItem = ({item}: { item: groupCategory }) => {
        if (this.shouldDisplayAccordion(item)) {
            return (
                <GroupListAccordion
                    item={item}
                    onGroupPress={this.onListItemPress}
                    onFavoritePress={this.onListFavoritePress}
                    currentSearchString={this.state.currentSearchString}
                    favoriteNumber={this.state.favoriteGroups.length}
                    height={LIST_ITEM_HEIGHT}
                />
            );
        } else
            return null;
    };

    generateData(fetchedData: { [key: string]: groupCategory }) {
        let data = [];
        for (let key in fetchedData) {
            this.formatGroups(fetchedData[key]);
            data.push(fetchedData[key]);
        }
        data.sort(sortName);
        data.unshift({name: i18n.t("planexScreen.favorites"), id: 0, content: this.state.favoriteGroups});
        return data;
    }

    formatGroups(item: groupCategory) {
        for (let i = 0; i < item.content.length; i++) {
            item.content[i].name = item.content[i].name.replace(REPLACE_REGEX, " ")
            item.content[i].isFav = this.isGroupInFavorites(item.content[i]);
        }
    }

    /**
     * Creates the dataset to be used in the FlatList
     *
     * @param fetchedData
     * @return {*}
     * */
    createDataset = (fetchedData: { [key: string]: groupCategory }) => {
        return [
            {
                title: '',
                data: this.generateData(fetchedData)
            }
        ];
    }

    render() {
        return (
            <WebSectionList
                {...this.props}
                createDataset={this.createDataset}
                autoRefreshTime={0}
                refreshOnFocus={false}
                fetchUrl={GROUPS_URL}
                renderItem={this.renderItem}
                updateData={this.state.currentSearchString + this.state.favoriteGroups.length}
                itemHeight={LIST_ITEM_HEIGHT}
            />
        );
    }
}

export default GroupSelectionScreen;