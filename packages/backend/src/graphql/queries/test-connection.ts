import Context from '../../types/express/context';
import App from '../../models/app';
import globalVariable from '../../helpers/global-variable';

type Params = {
  id: string;
  data: object;
};

const testConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  let connection = await context.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  const app = await App.findOneByKey(connection.key, false);
  const $ = await globalVariable({ connection, app });

  const isStillVerified = await app.auth.isStillVerified($);

  connection = await connection.$query().patchAndFetch({
    formattedData: connection.formattedData,
    verified: isStillVerified,
  });

  return connection;
};

export default testConnection;
