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

import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import React from 'react';
import * as rison from 'rison-node';
import { DecodeForm } from './form';

function decodeUrl({ inputValue }) {
  return decodeURIComponent(inputValue);
}

function encodeUrl({ inputValue }) {
  return encodeURIComponent(inputValue);
}

function decodeRison({ inputValue }) {
  try {
    const decodeObj = rison.decode(inputValue);
    return JSON.stringify(decodeObj);
  } catch (err) {
    return err;
  }
}

function encodeRison({ inputValue }) {
  try {
    const jsonObj = JSON.parse(inputValue);
    return rison.encode(jsonObj);
  } catch (err) {
    return err;
  }
}

export class Decoders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <h3>Decoders</h3>
        <EuiFlexGroup>
          <EuiFlexItem>
            <p>URL Decode: Paste Kibana App State or Reporting JobParams to get RISON</p>
            <DecodeForm decode={decodeUrl} buttonText="Decode" />
            <EuiSpacer />
          </EuiFlexItem>
          <EuiFlexItem>
            <p>JSON Decode: Paste RISON to get JSON</p>
            <DecodeForm decode={decodeRison} buttonText="Decode" />
            <EuiSpacer />
          </EuiFlexItem>
        </EuiFlexGroup>

        <h3>Encoders</h3>
        <EuiFlexGroup>
          <EuiFlexItem>
            <p>RISON Encode: Paste JSON to get RISON</p>
            <DecodeForm decode={encodeRison} buttonText="Encode" />
          </EuiFlexItem>
          <EuiFlexItem>
            <p>URL Encode: Paste RISON to get Kibana URL</p>
            <DecodeForm decode={encodeUrl} buttonText="Encode" />
          </EuiFlexItem>
        </EuiFlexGroup>
      </React.Fragment>
    );
  }
}
