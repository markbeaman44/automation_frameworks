from behave import given
from features.pages.login import login

@given('the user logs in using credentials "{username}" and "{password}"')
@given('logs in using credentials "{username}" and "{password}"')
def step_impl(context, username: str, password: str):
	login(context, username, password)
