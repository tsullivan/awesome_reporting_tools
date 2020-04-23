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
  CoreSetup,
  CoreStart,
  Logger,
  Plugin,
  PluginInitializerContext,
} from '../../../src/core/server';
import { ReportingSetup } from '../../../x-pack/legacy/plugins/reporting/server/types';
import { defineRoutes } from './routes';
import { AwesomeReportingToolsPluginSetup, AwesomeReportingToolsPluginStart } from './types';

interface PluginsSetup {
  reporting: ReportingSetup;
}

export class AwesomeReportingToolsPlugin
  implements
    Plugin<AwesomeReportingToolsPluginSetup, AwesomeReportingToolsPluginStart, PluginsSetup> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get('awesome');
  }

  public setup(core: CoreSetup, plugins: PluginsSetup) {
    const { reporting } = plugins;
    const router = core.http.createRouter();
    this.logger.info(`Reporting Plugin sourced from: ${reporting.source}`);

    // Register server side APIs
    defineRoutes(reporting.reportingCore, router, this.logger);
  }

  public start(core: CoreStart) {}

  public stop() {}
}
