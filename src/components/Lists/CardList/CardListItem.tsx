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
import {Caption, Card, Paragraph, TouchableRipple} from 'react-native-paper';
import {View} from 'react-native';
import type {ServiceItemType} from '../../../managers/ServicesManager';

type PropsType = {
  item: ServiceItemType;
};

function CardListItem(props: PropsType) {
  const {item} = props;
  const source =
    typeof item.image === 'number' ? item.image : {uri: item.image};
  return (
    <Card
      style={{
        width: '40%',
        margin: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
      <TouchableRipple style={{flex: 1}} onPress={item.onPress}>
        <View>
          <Card.Cover style={{height: 80}} source={source} />
          <Card.Content>
            <Paragraph>{item.title}</Paragraph>
            <Caption>{item.subtitle}</Caption>
          </Card.Content>
        </View>
      </TouchableRipple>
    </Card>
  );
}

export default React.memo(CardListItem, () => true);