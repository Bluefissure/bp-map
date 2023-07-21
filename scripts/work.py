import os
import json
import codecs
from collections import defaultdict

PAK_PATH = r'D:\FModel\Output\Exports\BLUEPROTOCOL'
APIEXT_PATH = r'D:\Code\BP\webrequest\logs\output'

OUTPUT_PATH = r'..\src\assets'

APIEXT_DATA = defaultdict(dict)
OUTPUT_TEXT = defaultdict(lambda: defaultdict(dict))
OUTPUT_DATA = defaultdict(lambda: defaultdict(list))

def load_apiext_texts():
	global OUTPUT_TEXT
	apiext_file = os.path.join(APIEXT_PATH, 'texts/ja_JP.json')
	with codecs.open(apiext_file, 'r', 'utf8') as f:
		apiext_texts = json.load(f)
	for item in apiext_texts:
		name = item['name']
		for text in item['texts']:
			text_id = text['id']
			OUTPUT_TEXT[name][text_id] = {
				'id': text_id,
				'ja_JP': text['text'],
			}



def load_pak_text(name):
	global OUTPUT_TEXT
	text_file = os.path.join(PAK_PATH, f'Content/Text/{name}.json')
	with codecs.open(text_file, 'r', 'utf8') as f:
		text_content = json.load(f)
	for item in text_content[0]['Properties']['TextTable']:
		text_id_number = item['Id']['IdNumber']
		text_id_string = item['Id']['IdString']
		id_type_map = {
			'FreeBuffTypes': text_id_number,
			'WarpPointName': text_id_string,
		}
		text_id = id_type_map.get(name, text_id_number)
		text = item['Text']
		OUTPUT_TEXT[name][text_id] = {
			'id': text_id,
			'ja_JP': text,
		}

def load_pak_texts():
	load_pak_text('FreeBuffTypes')
	load_pak_text('WarpPointName')


def get_apiext_items():
	global APIEXT_DATA
	if 'items' in APIEXT_DATA:
		return APIEXT_DATA['items']
	items_file = os.path.join(APIEXT_PATH, 'items.json')
	with codecs.open(items_file, 'r', 'utf8') as f:
		items_list = json.load(f)
	for item in items_list:
		stored_item = {
			'id': item['id'],
			'name': item['name'],
		}
		APIEXT_DATA['items'][item['id']] = stored_item
	return APIEXT_DATA['items']

def get_apiext_liquid_memories():
	global APIEXT_DATA
	if 'liquid_memory' in APIEXT_DATA:
		return APIEXT_DATA['liquid_memory']
	lm_file = os.path.join(APIEXT_PATH, 'liquid_memory.json')
	with codecs.open(lm_file, 'r', 'utf8') as f:
		lm_list = json.load(f)
	for lm in lm_list:
		stored_item = {
			'id': lm['id'],
			'name': lm['efficacy_name'],
		}
		APIEXT_DATA['liquid_memory'][lm['id']] = stored_item
	return APIEXT_DATA['liquid_memory']

def get_apiext_adventure_boards():
	global APIEXT_DATA
	if 'adventure_boards' in APIEXT_DATA:
		return APIEXT_DATA['adventure_boards']
	boards_file = os.path.join(APIEXT_PATH, 'master_adventure_board.json')
	with codecs.open(boards_file, 'r', 'utf8') as f:
		boards_list = json.load(f)
	for board in boards_list:
		stored_item = {
			'id': board['id'],
			'name': board['name'],
		}
		APIEXT_DATA['adventure_boards'][board['id']] = stored_item
	return APIEXT_DATA['adventure_boards']

def get_item_text(item_id):
	global OUTPUT_TEXT
	items = get_apiext_items()
	item = items.get(item_id, {})
	item_name_id = item.get('name', 0)
	item_text = OUTPUT_TEXT['item_text']
	result = item_text.get(item_name_id, {})
	return result

def get_liquid_memory_text(lm_id):
	global OUTPUT_TEXT
	lms = get_apiext_liquid_memories()
	lm = lms.get(lm_id, {})
	lm_name_id = lm.get('name', 0)
	lm_text = OUTPUT_TEXT['master_liquid_memory_text']
	result = lm_text.get(lm_name_id, {})
	return result

def get_adventure_board_text(ab_id):
	global OUTPUT_TEXT
	boards = get_apiext_adventure_boards()
	board = boards.get(ab_id, {})
	board_name_id = board.get('name', 0)
	board_text = OUTPUT_TEXT['master_adventure_boards_text']
	result = board_text.get(board_name_id, {})
	return result

def get_freebuff_text(freebuff_type):
	global OUTPUT_TEXT
	freebuff_text = OUTPUT_TEXT['FreeBuffTypes']
	return freebuff_text.get(freebuff_type, {})

def get_warppoint_text(warppoint_id):
	global OUTPUT_TEXT
	warppoint_text = OUTPUT_TEXT['WarpPointName']
	return warppoint_text.get(warppoint_id, {})


def get_apiext_freebuffs():
	global APIEXT_DATA
	if 'freebuff' in APIEXT_DATA:
		return APIEXT_DATA['freebuff']
	freebuffs_file = os.path.join(APIEXT_PATH, 'freebuff.json')
	with codecs.open(freebuffs_file, 'r', 'utf8') as f:
		freebuffs_list = json.load(f)
	for freebuff in freebuffs_list:
		stored_freebuff = {
			'id': freebuff['id'],
			'lot_rate': list(map(lambda x: {
				'type': x['buffsorting_id'][0]['type'],
				'rate': x['rate'],
				'text': get_freebuff_text(x['buffsorting_id'][0]['type'])
			}, freebuff['lot_rate'])),
		}
		APIEXT_DATA['freebuff'][freebuff['id']] = stored_freebuff
	return APIEXT_DATA['freebuff']

def get_apiext_treasures():
	global APIEXT_DATA
	if 'treasures' in APIEXT_DATA:
		return APIEXT_DATA['treasures']
	treasures_file = os.path.join(APIEXT_PATH, 'treasures.json')
	with codecs.open(treasures_file, 'r', 'utf8') as f:
		treasures_list = json.load(f)
	for treasure in treasures_list:
		lot_rates = []
		for x in treasure['lot_rate']:
			text = ''
			if x['reward_type'] == 3:
				text = get_item_text(x['reward_master_id'])
			elif x['reward_type'] == 15:
				text = get_liquid_memory_text(x['reward_master_id'])
			elif x['reward_type'] == 28:
				text = get_adventure_board_text(x['reward_master_id'])
			else:
				text = {
					'id': x['reward_master_id'],
					'ja_JP': 'Unknown Type',
				}
			lot_rates.append({
				'reward_master_id': x['reward_master_id'],
				'reward_type': x['reward_type'],
				'reward_amount_min': x['reward_amount_min'],
				'reward_amount_max': x['reward_amount_max'],
				'rate': x['rate'],
				'text': text,
			})
		stored_treasure = {
			'id': treasure['id'],
			'lot_rate': lot_rates,
		}
		APIEXT_DATA['treasures'][treasure['id']] = stored_treasure
	return APIEXT_DATA['treasures']


def get_positions(category, entry_type, file):
	with codecs.open(file, 'r', 'utf8') as f:
		entry_list = json.load(f)
	prefix = file.split('\\')[-1].split('.')[0]
	idx_map = {}
	results = []
	for (idx, entry) in enumerate(entry_list):
		idx_map[idx] = entry
	for entry in entry_list:
		if entry["Type"] != entry_type:
			continue
		cat_id = entry["Properties"][f"{category}Id"]
		cat_tag = entry["Properties"].get(f"{category}Tag", entry["Properties"][f"{category}Id"])
		root_id = entry["Properties"]["RootComponent"]["ObjectPath"].split(".")[-1]
		result = {
			f"{category}Id": cat_id,
			f"{category}Tag": cat_tag,
			f"{category}Key": f"{prefix}_{cat_tag}",
		}
		if int(root_id) in idx_map:
			pos = idx_map[int(root_id)]
			result["RelativeLocation"] = pos["Properties"]["RelativeLocation"]
		results.append(result)
	return results


def gen_gather_points(pu_file):
	results = get_positions("GatherPoint", "BP_GatherPointAuthor_C", pu_file)
	# populate trasures
	treasures = get_apiext_treasures()
	for result in results:
		gp_id = result['GatherPointId']
		result['Data'] = treasures[gp_id]
	return results

def gen_free_buffs(pu_file):
	results = get_positions("FreeBuffPoint", "BP_FreeBuffPointAuthor_C", pu_file)
	# populate freebuffs
	freebuffs = get_apiext_freebuffs()
	for result in results:
		fp_id = result['FreeBuffPointId']
		result['Data'] = freebuffs[fp_id]
	return results

def gen_treasures(pu_file):
	results = get_positions("TreasureBox", "BP_TreasureBoxAuthor_C", pu_file)
	# populate results
	treasures = get_apiext_treasures()
	for result in results:
		gp_id = result['TreasureBoxId']
		result['Data'] = treasures[gp_id]
	return results

def gen_warp_points(sc_file):
	results = get_positions("WarpPoint", "BP_LocalWarpPoint_C", sc_file)
	results += get_positions("WarpPoint", "BP_WarpPoint_C", sc_file)
	# populate results
	for result in results:
		wp_id = result['WarpPointId']
		result['Data'] = get_warppoint_text(wp_id)
	return results

def gen_nappos(sc_file):
	results = get_positions("ProfileData", "BP_NpcSpawnPoint_NappoTraverse_C", sc_file)
	# populate results
	print(results)
	return results

def analysis_sc_file(zone_id, sc_file):
	global OUTPUT_DATA
	gen_sc_elements_func = {
		'WarpPoints': gen_warp_points,
		'Nappos': gen_nappos,
	}
	for (keyword, func) in gen_sc_elements_func.items():
		OUTPUT_DATA[zone_id][keyword] += func(sc_file)

def analysis_pu_file(zone_id, pu_file):
	global OUTPUT_DATA
	gen_pu_elements_func = {
		'GatherPoints': gen_gather_points,
		'FreeBuffs': gen_free_buffs,
		'Treasures': gen_treasures,
	}
	for (keyword, func) in gen_pu_elements_func.items():
		OUTPUT_DATA[zone_id][keyword] += func(pu_file)

def analysis_en_file(zone_id, en_file):
	pass

def analysis_sublevel_file(path, file):
	analytic_function_map = {
		'_SC.json': analysis_sc_file,
		'_SCBase.json': analysis_sc_file,
		'_Nappo.json': analysis_sc_file,
		'_SCBase.json': analysis_sc_file,
		'_PU.json': analysis_pu_file,
		'_EN.json': analysis_en_file,
	}
	path_segs = path.split(os.sep)
	zone_id = path_segs[-2]
	# don't analysis dng resource while pub resource exists
	categories = ['dng', 'pat']
	for cat in categories:
		if (file.startswith(cat) and os.path.exists(
			os.path.join(path, file.replace(cat, 'pub')))):
			return
	for (suffix, analysis_func) in analytic_function_map.items():
		if file.endswith(suffix):
			analysis_func(zone_id, os.path.join(path, file))


def analysis_top_file(path, file):
	pass

def analysis_bgconfig_file(file):
	with codecs.open(file, 'r', 'utf8') as f:
		config_map = json.load(f)
	config_rows = config_map[0]['Rows']
	configs = {}
	for (zone_id, config) in config_rows.items():
		configs[zone_id] = {
			'ZoneId': config['ZoneId'],
			'CapturePosition': config['CapturePosition'],
			'CaptureSize': config['CaptureSize'],
			'WorldMapPosition': config['WorldMapPosition'],
			'ResolutionMultiplier': config['ResolutionMultiplier'],
		}
	return configs


if __name__ == '__main__':
	load_apiext_texts()
	load_pak_texts()
	for (name, entries) in OUTPUT_TEXT.items():
		output_path = os.path.join(OUTPUT_PATH, 'text')
		if not os.path.exists(output_path):
			os.makedirs(output_path)
		output_file = os.path.join(output_path, f'{name}.json')
		with codecs.open(output_file, 'w', 'utf8') as f:
			json.dump(entries, f)

	for (path, folders, files) in os.walk(os.path.join(PAK_PATH, 'Content', 'Maps')):
		# print((path, folders, files))
		if path.endswith('sublevel'):
			for file in files:
				analysis_sublevel_file(path, file)
		# if 'sublevel' in folders:
		# 	for file in files:
		# 		if file.endswith('_Top.json'):
		# 			analysis_top_file(path, file)

	bgconfig_file = os.path.join(
		PAK_PATH, 'Content', 'Blueprints', 'UI','Map', 'DT_MapBGConfig.json')
	bgconfigs = analysis_bgconfig_file(bgconfig_file)
	bgconfig_output_file = os.path.join(OUTPUT_PATH, 'data', 'bgconfig.json')
	with codecs.open(bgconfig_output_file, 'w', 'utf8') as f:
		json.dump(bgconfigs, f)

	for (zone_id, entries) in OUTPUT_DATA.items():
		output_path = os.path.join(OUTPUT_PATH, 'data', zone_id)
		if not os.path.exists(output_path):
			os.makedirs(output_path)
		for (key, value) in entries.items():
			output_file = os.path.join(output_path, f'{key}.json')
			with codecs.open(output_file, 'w', 'utf8') as f:
				json.dump(value, f)

