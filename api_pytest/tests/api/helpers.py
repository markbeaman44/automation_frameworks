from tests.api.types.interface import pick_option

def calculate_value(pick_option: pick_option, value: int) -> int:
	if (pick_option == 'multiply'):
		return value * 1.60934
	if (pick_option == 'divide'):
		return value / 1.60934