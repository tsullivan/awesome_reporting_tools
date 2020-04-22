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

import { IRouter, Logger, RouteValidatorFullConfig } from '../../../../src/core/server';
import { getRunner, UrlTestResult } from '../lib/performance';

interface PostBody {
  test_urls: string[];
}

export async function registerPerformance(router: IRouter, logger: Logger) {
  const runner = getRunner(logger);

  router.post<void, void, PostBody>(
    {
      path: '/api/awesome_reporting_tools/performance/run',
      validate: false,
    },
    async (context, request, response) => {
      const { test_urls: testUrls } = request.body;
      const startTime = Date.now();
      return runner
        .run(testUrls)
        .then((data: UrlTestResult[]) => {
          const screenshots = data.map((pageData: UrlTestResult) => {
            return pageData.screenshots.map(ss => ss.base64EncodedData).join();
          });
          const json = {
            test_name: 'multi-urls',
            num_urls: data.length,
            num_screenshots: screenshots.length,
            data_size: Buffer.from(screenshots.join(''), 'utf8').length,
            timing: {
              millis: Date.now() - startTime,
            },
          };
          return response.ok({ body: json });
        })
        .catch(err => {
          logger.error(err);
          return response.internalError(err);
        });

      // return response.ok({ body: { string: 'testing' } });
    }
  );
}
