import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { K8sNameInput } from './components/K8sNameInput/K8sNameInput';
import { GenericList } from './components/GenericList/GenericList';

import { handleDelete } from './components/GenericList/actionHandlers/simpleDelete';

import CustomPropTypes from './typechecking/CustomPropTypes';

export { CustomPropTypes, GenericList, K8sNameInput, handleDelete };
