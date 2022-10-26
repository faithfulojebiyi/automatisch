import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import { DateTime } from 'luxon';

const fetchMessages = async ($: IGlobalVariable) => {
  const toNumber = $.step.parameters.toNumber as string;
  const requestPath = `/2010-04-01/Accounts/${$.auth.data.accountSid}/Messages.json?To=${toNumber}`;

  let response;

  do {
    response = await $.http.get(requestPath, {
      params: { PageSize: '20' },
    });

    if (response.data.messages.length > 0) {
      response.data.messages.forEach((message: IJSONObject) => {
        const timestamp = DateTime.fromISO(
          message.date_created as string
        ).toMillis();

        if (timestamp <= Number($.flow.lastInternalId) && !$.execution.testRun)
          return;

        const dataItem = {
          raw: message,
          meta: {
            internalId: timestamp.toString(),
          },
        };

        $.pushTriggerItem(dataItem);
      });
    }
  } while (response.data.next_page_uri && !$.execution.testRun);
};

export default fetchMessages;
