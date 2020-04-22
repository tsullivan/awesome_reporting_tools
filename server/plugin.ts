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
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { AwesomeReportingToolsPluginSetup, AwesomeReportingToolsPluginStart } from './types';
import { defineRoutes } from './routes';

export class AwesomeReportingToolsPlugin
  implements Plugin<AwesomeReportingToolsPluginSetup, AwesomeReportingToolsPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get('awesome');
  }

  public setup(core: CoreSetup) {
    this.logger.debug('awesome_reporting_tools: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router, this.logger);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.info('awesome_reporting_tools: Started');
    return {};
  }

  public stop() {}
}