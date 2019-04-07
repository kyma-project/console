import ODataProductV2 from './ODataProductV2'; // does not work, properties cut off
import ODataNext from './ODataNext'; // library cuts off many fields, not working
import ODataFile1 from './ODataFile'; // works
import ODataFile2 from './ODataFile2'; // works
import ODataTripV4 from './ODataTripV4'; // works
import ODataFavourite3 from './ODataFavourite3'; // works - no annotations
import ODataFav5 from './ODataFav5'; // works
import ODataFav1 from './ODataFav1'; // works - basic annotations
import ODataProductV4 from './ODataProductV4'; // works - use this to see Service Documentation / Annotations
import ODataProductsV3 from './ODataProductsV3'; // works
import ODataFav11 from './ODataFav11'; // works //most complex
import ODataFav21 from './ODataFav21'; // works // there are errors in console
import ODataNorthWindV2 from './ODataNorthWindV2'; // works
import ODataFav3 from './ODataFav3'; // works, but there are certain errors - look at console

const mocks = {
  ODataProductV2,
  ODataNext,
  ODataFile1,
  ODataFile2,
  ODataTripV4,
  ODataFavourite3,
  ODataFav5,
  ODataFav1,
  ODataProductV4,
  ODataProductsV3,
  ODataFav11,
  ODataFav21,
  ODataNorthWindV2,
  ODataFav3,
};
export { mocks };
