/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiPanel,
  EuiTab,
  EuiTabs,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import React from 'react';
import { HttpSetup } from '../../../../src/core/public';
import { DangerZone } from './danger_zone';
import { Decoders } from './decoders';
import { Performance } from './performance';

interface Props {
  http: HttpSetup;
}

interface State {
  selectedTabId: string;
}

export class AwesomeReportingToolsApp extends React.Component<Props, State> {
  private tabs: Array<{ id: string; name: string; disabled: boolean; href?: string }>;

  constructor(props: Props) {
    super(props);

    this.tabs = [
      {
        id: 'performance',
        name: 'Performance',
        disabled: false,
      },
      {
        id: 'decoders',
        name: 'Decoding Tools',
        disabled: false,
      },
      {
        id: 'danger_zone',
        name: 'Danger Zone',
        disabled: false,
      },
    ];

    this.state = {
      selectedTabId: 'performance',
    };
  }

  onSelectedTabChanged = id => {
    this.setState({
      selectedTabId: id,
    });
  };

  renderTabs() {
    return this.tabs.map((tab, index) => (
      <EuiTab
        {...(tab.href && { href: tab.href, target: '_blank' })}
        onClick={() => this.onSelectedTabChanged(tab.id)}
        isSelected={tab.id === this.state.selectedTabId}
        disabled={tab.disabled}
        key={index}
      >
        {tab.name}
      </EuiTab>
    ));
  }

  renderSelectedTab() {
    if (this.state.selectedTabId === 'decoders') {
      return <Decoders />;
    } else if (this.state.selectedTabId === 'danger_zone') {
      return <DangerZone http={this.props.http} />;
    }

    return <Performance http={this.props.http} />;
  }

  render() {
    return (
      <EuiPage className="reportingTools">
        <EuiPageBody>
          <EuiPageHeader>
            <EuiTitle size="l">
              <h1>Reporting Tools</h1>
            </EuiTitle>
          </EuiPageHeader>
          <EuiPageContent>
            <EuiPageContentBody>
              <EuiTabs>{this.renderTabs()}</EuiTabs>
              <EuiText>
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiPanel>{this.renderSelectedTab()}</EuiPanel>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiText>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}
