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
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiLoadingSpinner,
  EuiSpacer,
  EuiTextArea,
} from '@elastic/eui';
import React from 'react';
import { HttpSetup } from '../../../../src/core/public';

interface Props {
  http: HttpSetup;
}
interface State {
  isLoading: boolean;
  resultText: string | null;
  isError: boolean;
}

export class DangerZone extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = { isLoading: false, resultText: null, isError: false };

    this.onClick = this.onClick.bind(this);
    this.onClickClear = this.onClickClear.bind(this);
  }

  async sendRequest() {
    this.setState(() => ({ isLoading: true }));

    let result;
    try {
      result = await this.props.http.post({
        path: '/api/awesome_reporting_tools/delete_all_reports',
      });
    } catch (err) {
      this.setState(() => ({ isLoading: false, resultText: err, isError: true }));
      return;
    }

    this.setState(() => ({
      isLoading: false,
      resultText: JSON.stringify(result),
    }));
  }

  onClick() {
    this.setState(() => ({ resultText: '', isError: false }));
    this.sendRequest();
  }

  onClickClear() {
    this.setState(() => ({ resultText: '' }));
  }

  renderSpinner() {
    if (this.state.isLoading) {
      return <EuiLoadingSpinner size="m" />;
    }
    return null;
  }

  render() {
    return (
      <React.Fragment>
        <h3>Danger Zone</h3>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiForm>
              <EuiFormRow>
                <React.Fragment>
                  <EuiButton type="submit" fill onClick={this.onClick}>
                    Delete all Reports
                  </EuiButton>
                  &nbsp;&nbsp;
                  {this.renderSpinner()}
                </React.Fragment>
              </EuiFormRow>
              <EuiSpacer />

              <EuiFormRow label="Result">
                <EuiTextArea
                  value={this.state.resultText || ''}
                  readOnly
                  isInvalid={this.state.isError}
                />
              </EuiFormRow>
            </EuiForm>
          </EuiFlexItem>
        </EuiFlexGroup>
      </React.Fragment>
    );
  }
}
