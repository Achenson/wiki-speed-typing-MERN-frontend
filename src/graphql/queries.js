// parsing graphql queries
import { gql } from "apollo-boost";

export const updateStats = gql`
  mutation AddScore(
    $userId: String!
    $five_s: [[Float]]
    $one_min: [[Float]]
    $two_min: [[Float]]
    $five_min: [[Float]]
    $ten_min: [[Float]]
  ) {
    addScore(
      userId: $userId
      five_s: $five_s
      one_min: $one_min
      two_min: $two_min
      five_min: $five_min
      ten_min: $ten_min
    ) {
      five_s
      one_min
      two_min
      five_min
      ten_min
    }
  }
`;

export const addNewUserMutation = gql`
  mutation AddNewUser($username: String!, $email: String!, $password: String!) {
    addUser(name: $username, email: $email, password: $password) {
      id
      name
      email
      password
    }
  }
`;

export const changePassword = gql`
  mutation ChangePassword($id: ID!, $password: String!, $newPassword: String!) {
    changePassword(id: $id, password: $password, newPassword: $newPassword) {
      name
      email
    }
  }
`;

export const deleteUser = gql`
  mutation DeleteUser($id: ID!, $password: String!) {
    deleteUser(id: $id, password: $password) {
      name
      email
    }
  }
`;

export const getStatsQuery = gql`
  query Score($userId: ID) {
    score(userId: $userId) {
      five_s
      one_min
      two_min
      five_min
      ten_min
    }
  }
`;

export const getUserByEmailQuery = gql`
  query User($email: String) {
    user(email: $email) {
      name
      email
    }
  }
`;

export const getUserByIdQuery = gql`
  query UserById($id: ID) {
    userById(id: $id) {
      name
      email
    }
  }
`;

export const loginMutation = gql`
  mutation Login($email_or_name: String!, $password: String!) {
    login(email_or_name: $email_or_name, password: $password) {
      userId
      token
    }
  }
`;

export const logoutMutation = gql`
  mutation Logout {
    logout
  }
`;

export const forgotPassword = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const changePasswordAfterForgot = gql`
  mutation ChangePasswordAfterForgot($token: String!, $password: String!) {
    changePasswordAfterForgot(token: $token, password: $password) {
      userId
      token
    }
  }
`;
