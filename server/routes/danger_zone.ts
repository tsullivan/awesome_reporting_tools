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

import { IRouter, Logger } from '../../../../src/core/server';

export async function registerDangerZone(router: IRouter, logger: Logger) {
  router.post(
    {
      path: '/api/awesome_reporting_tools/delete_all_reports',
      validate: false,
    },
    async (context, request, response) => {
      const { elasticsearch } = context.core;
      return await elasticsearch.dataClient
        .callAsCurrentUser('deleteByQuery', {
          index: '.reporting-*',
          body: { query: { match_all: {} } },
        })
        .then(body => {
          logger.info(JSON.stringify({ deleted: body }));
          return response.ok({ body });
        })
        .catch(err => {
          logger.error(err);
          return response.internalError(err);
        });
    }
  );
}
