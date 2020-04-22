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

import * as Rx from 'rxjs';
import { Logger } from '../../../../../src/core/server';

interface Headers {
  headers: { authorization: string };
}

function getHeaders(server): Headers {
  const config = server.config();
  const configAuth = config.get('reporting_tools.pageLoadAuth');

  return {
    headers: {
      authorization: `Basic ${Buffer.from(configAuth).toString('base64')}`,
    },
  };
}

export interface UrlTestResult {
  screenshots: Screenshot[];
}

type PluginScreenshotObservable = ({
  logger,
  urls,
  conditionalHeaders,
  layout,
  browserTimezone,
}: ScreenshotObservableOpts) => Rx.Observable<UrlTestResult[]>;

export class PerformanceRunner {
  private screenshotsObservable: PluginScreenshotObservable;
  private headers: Headers;
  private logger: Logger;

  constructor(server, logger: Logger) {
    this.headers = getHeaders(server);
    this.logger = logger;

    this.screenshotsObservable = (screenshotsObservableFactory(
      server
    ) as unknown) as PluginScreenshotObservable;
  }

  public async run(urls: string[]): Promise<UrlTestResult[]> {
    this.logger.info('Launching browser...');

    return new Promise((resolve, reject): object => {
      const layout = new PreserveLayout({ width: 1200, height: 900 });

      return this.screenshotsObservable({
        urls,
        conditionalHeaders: this.headers as any,
        layout,
        browserTimezone: 'UTC',
        logger: this.logger as any,
      }).subscribe(
        (data: UrlTestResult[]): UrlTestResult[] => {
          resolve(data);
          return data;
        },
        (err: Error): void => {
          this.logger.error(`screenshotting threw an exception: ${err}`);
          reject(err);
        },
        (): void => {
          this.logger.info('Test complete.');
        }
      );
    });
  }
}
