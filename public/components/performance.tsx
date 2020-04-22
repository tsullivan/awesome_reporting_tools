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
  EuiDescribedFormGroup,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiLoadingSpinner,
  EuiTextArea,
} from '@elastic/eui';
import React, { Fragment } from 'react';
import { HttpSetup } from '../../../../src/core/public';

interface Props {
  http: HttpSetup;
}
interface State {
  isLoading: boolean;
  resultText: string | null;
  isError: boolean;
  urls: string[];
}

export class Performance extends React.Component<Props, State> {
  private renderUrlTextInput: (value: any, index: any) => JSX.Element;

  state = {
    isLoading: false,
    resultText: null,
    isError: false,
    urls: [''],
  };

  constructor(props) {
    super(props);

    this.renderUrlTextInput = (value, index) => (
      <EuiFormRow key={`urlTextInput${index}`}>
        <EuiFieldText placeholder="URL" value={value} onChange={this.onUpdateUrls(index)} />
      </EuiFormRow>
    );

    this.onUpdateUrls = this.onUpdateUrls.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onClickClear = this.onClickClear.bind(this);
    this.onClickAddUrl = this.onClickAddUrl.bind(this);
  }

  async sendRequest() {
    this.setState(() => ({ isLoading: true }));

    let result;
    const testUrls = this.state.urls;
    try {
      result = await this.props.http.post({
        path: '/api/reporting-performance/run',
        body: JSON.stringify({ 'test_urls': testUrls }) // prettier-ignore
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

  onUpdateUrls(index) {
    return value => {
      const targetText = value.target.value;
      const myUrls = [...this.state.urls];
      myUrls[index] = targetText;
      this.setState(() => ({
        urls: myUrls,
      }));
    };
  }

  onClick() {
    this.setState(() => ({ resultText: '', isError: false }));
    this.sendRequest();
  }

  onClickClear() {
    this.setState(() => ({ resultText: '' }));
  }

  onClickAddUrl() {
    const urls = this.state.urls;
    this.setState(() => ({
      urls: urls.concat(''),
    }));
  }

  renderSpinner() {
    if (this.state.isLoading) {
      return <EuiLoadingSpinner size="m" />;
    }
    return null;
  }

  render() {
    return (
      <Fragment>
        <h3>Multi-URL Screenshot Performance Test</h3>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiForm>
              <EuiDescribedFormGroup
                title={<h3>URLs</h3>}
                description={<Fragment>The Kibana URLs.</Fragment>}
              >
                {this.state.urls.map((url, i) => {
                  return this.renderUrlTextInput(url, i);
                })}
                <EuiFormRow>
                  <EuiButton type="submit" onClick={this.onClickAddUrl}>
                    Add Url
                  </EuiButton>
                </EuiFormRow>
              </EuiDescribedFormGroup>

              <EuiDescribedFormGroup title={<h3>Actions</h3>}>
                <EuiFormRow>
                  <Fragment>
                    <EuiButton type="submit" onClick={this.onClick}>
                      Start test
                    </EuiButton>
                    &nbsp;&nbsp;
                    {this.renderSpinner()}
                  </Fragment>
                </EuiFormRow>
              </EuiDescribedFormGroup>

              <EuiDescribedFormGroup title={<h3>Result</h3>}>
                <EuiFormRow>
                  <EuiTextArea
                    value={this.state.resultText || ''}
                    readOnly
                    isInvalid={this.state.isError}
                  />
                </EuiFormRow>
                <EuiFormRow>
                  <EuiButton color="secondary" type="submit" onClick={this.onClickClear}>
                    Clear result
                  </EuiButton>
                </EuiFormRow>
              </EuiDescribedFormGroup>
            </EuiForm>
          </EuiFlexItem>
        </EuiFlexGroup>
      </Fragment>
    );
  }
}
