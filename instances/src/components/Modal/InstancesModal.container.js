import React from 'react';
import {graphql, withApollo, compose} from 'react-apollo';
import InstancesModal from './InstancesModal.component';
import {USAGE_KIND_RESOURCES_QUERY, USAGE_KINDS_QUERY,} from './queries';
import builder from "../../commons/builder";

const InstanceModalComponent = ({client, ...otherProps}) => {
    const fetchUsageKindResources = (usageKind) => {
        return client.query({
            query: USAGE_KIND_RESOURCES_QUERY,
            variables: {
                usageKind: usageKind,
                environment: builder.getCurrentEnvironmentId(),
            },
            fetchPolicy: 'network-only',
        })
    };
    return (
        <InstancesModal
            fetchUsageKindResources={fetchUsageKindResources}
            {...otherProps}
        />)
};

const InstanceModalComponentWithCompose = compose(
    graphql(USAGE_KINDS_QUERY, {
        name: 'usageKinds',
        options: () => {
            return {
                fetchPolicy: 'network-only',
            };
        },
    })
)(InstanceModalComponent);

export default withApollo(InstanceModalComponentWithCompose);