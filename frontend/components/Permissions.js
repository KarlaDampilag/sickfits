import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const ALL_USERS_QUERY = gql`
    query {
        users {
            id
            name
            email
            permissions
        }
    }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation updatePermissions($permissions: [Permission], $userId: ID!) {
        updatePermissions(permissions: $permissions, userId: $userId) {
            id
            name
            email
            permissions
        }
    }
`;

const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE'
];

const Permissions = () => (
    <Query query={ALL_USERS_QUERY}>
        {({ data, loading, error }) => (
            <div>
                <ErrorMessage error={error} />
                <div>
                    <h2>Manage Permissions</h2>
                    <Table>
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(user => <UserPermissions user={user} key={user.id} />)}
                        </tbody>
                    </Table>
                </div>
            </div>
        )}
    </Query>
);

const UserPermissions = (props) => {
    UserPermissions.propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions: PropTypes.array
        }).isRequired
    }

    const [permissions, setPermissions] = React.useState(props.user.permissions);

    const handlePermissionChange = (e) => {
        const checkbox = e.target;
        // copy current permissions
        let updatedPermissions = [...permissions];
        // check if you have to remove or add this permission
        if (checkbox.checked) {
            updatedPermissions.push(checkbox.value);
        } else {
            updatedPermissions = updatedPermissions.filter(permission => permission != checkbox.value);
        }
        setPermissions(updatedPermissions);
    }

    return (
        <Mutation
            mutation={UPDATE_PERMISSIONS_MUTATION}
            variables={{ permissions: permissions, userId: props.user.id }}
        >
            {(updatePermissions, { loading, error }) => (
                <>
                    {error && <tr><td colspan='12'><ErrorMessage error={error} /></td></tr>}
                    <tr>
                        <td>{props.user.name}</td>
                        <td>{props.user.email}</td>
                        {possiblePermissions.map(permission =>
                            <td key={permission}>
                                <label htmlFor={`${props.user.id}-permission-${permission}`}>
                                    <input
                                        id={`${props.user.id}-permission-${permission}`}
                                        type='checkbox'
                                        checked={permissions.includes(permission)}
                                        value={permission}
                                        onChange={handlePermissionChange}
                                    />
                                </label>
                            </td>
                        )}
                        <td>
                            <SickButton disabled={loading} onClick={updatePermissions}>
                                Updat{loading ? 'ing' : 'e'}
                            </SickButton>
                        </td>
                    </tr>
                </>
            )}
        </Mutation>
    )
}
export default Permissions;