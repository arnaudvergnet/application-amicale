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
import { Avatar, Button, Card, Paragraph, withTheme } from 'react-native-paper';
import i18n from 'i18n-js';
import { Linking, StyleSheet, View } from 'react-native';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import Urls from '../../constants/Urls';

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  card: {
    flex: 1,
    flexWrap: 'wrap',
  },
  content: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
  },
});

function getButtons(isFeedback: boolean) {
  return (
    <Card.Actions style={styles.card}>
      {isFeedback ? (
        <View style={styles.content}>
          <Button
            icon="email"
            mode="contained"
            style={styles.button}
            onPress={() => {
              Linking.openURL(Urls.feedback.mail);
            }}
          >
            MAIL
          </Button>
          <Button
            icon="facebook"
            mode="contained"
            color="#2e88fe"
            style={styles.button}
            onPress={() => {
              Linking.openURL(Urls.feedback.facebook);
            }}
          >
            Facebook
          </Button>
          <Button
            icon="discord"
            mode="contained"
            color="#7289da"
            style={styles.button}
            onPress={() => {
              Linking.openURL(Urls.feedback.discord);
            }}
          >
            Discord
          </Button>
        </View>
      ) : (
        <View style={styles.content}>
          <Button
            icon="git"
            mode="contained"
            color="#609927"
            style={styles.button}
            onPress={() => {
              Linking.openURL(Urls.feedback.git);
            }}
          >
            GITETUD
          </Button>
          <Button
            icon="calendar"
            mode="contained"
            color="#026AA7"
            style={styles.button}
            onPress={() => {
              Linking.openURL(Urls.feedback.trello);
            }}
          >
            TRELLO
          </Button>
        </View>
      )}
    </Card.Actions>
  );
}

function FeedbackScreen() {
  return (
    <CollapsibleScrollView style={styles.container}>
      <Card>
        <Card.Title
          title={i18n.t('screens.feedback.feedback')}
          subtitle={i18n.t('screens.feedback.feedbackSubtitle')}
          left={(iconProps) => (
            <Avatar.Icon size={iconProps.size} icon="comment" />
          )}
        />
        <Card.Content>
          <Paragraph>
            {i18n.t('screens.feedback.feedbackDescription')}
          </Paragraph>
        </Card.Content>
        {getButtons(true)}
        <Card.Title
          title={i18n.t('screens.feedback.contribute')}
          subtitle={i18n.t('screens.feedback.contributeSubtitle')}
          left={(iconProps) => (
            <Avatar.Icon size={iconProps.size} icon="handshake" />
          )}
        />
        <Card.Content>
          <Paragraph>
            {i18n.t('screens.feedback.contributeDescription')}
          </Paragraph>
        </Card.Content>
        {getButtons(false)}
      </Card>
    </CollapsibleScrollView>
  );
}

export default withTheme(FeedbackScreen);
