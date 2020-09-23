/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import {Collapsible} from 'react-navigation-collapsible';
import {CommonActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import CardList from '../../components/Lists/CardList/CardList';
import type {ServiceCategoryType} from '../../managers/ServicesManager';

type PropsType = {
  navigation: StackNavigationProp<any>;
  route: {params: {data: ServiceCategoryType | null}};
  collapsibleStack: Collapsible;
};

class ServicesSectionScreen extends React.Component<PropsType> {
  finalDataset: null | ServiceCategoryType;

  constructor(props: PropsType) {
    super(props);
    this.finalDataset = null;
    this.handleNavigationParams();
  }

  /**
   * Recover the list to display from navigation parameters
   */
  handleNavigationParams() {
    const {props} = this;
    if (props.route.params.data) {
      this.finalDataset = props.route.params.data;
      // reset params to prevent infinite loop
      props.navigation.dispatch(CommonActions.setParams({data: null}));
      props.navigation.setOptions({
        headerTitle: this.finalDataset.title,
      });
    }
  }

  render() {
    if (!this.finalDataset) {
      return null;
    }
    return (
      <CardList dataset={this.finalDataset.content} isHorizontal={false} />
    );
  }
}

export default ServicesSectionScreen;