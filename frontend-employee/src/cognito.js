import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, GetUserCommand, ChangePasswordCommand, UpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";
import * as jose from "jose";

const clientID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

export function cognitoSignUp(email, username, password) {
  return client.send(
    new SignUpCommand({
      ClientId: clientID,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    })
  );
}

export async function cognitoLogin(username, password) {
  const temp = await client.send(
    new InitiateAuthCommand({
      ClientId: clientID,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    })
  );
  const claims = jose.decodeJwt(temp.AuthenticationResult.IdToken);
  return { accessToken: temp.AuthenticationResult.AccessToken, username: claims["cognito:username"], cognitoGroup: claims?.["cognito:groups"]?.[0] ?? "customer" };
}

export function cognitoGetUserData(accessToken) {
  return client.send(
    new GetUserCommand({
      AccessToken: accessToken,
    })
  );
}

export function cognitoChangePassword(accessToken, oldPassword, newPassword) {
  return client.send(
    new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
    })
  );
}

export function cognitoChangeUserAttributes(accessToken, email, name) {
  return client.send(
    new UpdateUserAttributesCommand({
      AccessToken: accessToken,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "name",
          Value: name,
        },
      ],
    })
  );
}
