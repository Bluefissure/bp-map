import json

def gen_gather_points(prefix, entry_list):
	idx_map = {}
	results = []
	for (idx, entry) in enumerate(entry_list):
		idx_map[idx] = entry
	for entry in entry_list:
		if entry["Type"] != "BP_GatherPointAuthor_C":
			continue
		gp_id = entry["Properties"]["GatherPointId"]
		gp_tag = entry["Properties"]["GatherPointTag"]
		root_id = entry["Properties"]["RootComponent"]["ObjectPath"].split(".")[-1]
		result = {
			"GatherPointId": gp_id,
			"GatherPointTag": gp_tag,
			"GatherPointKey": f"{prefix}_{gp_tag}",
		}
		if int(root_id) in idx_map:
			pos = idx_map[int(root_id)]
			result["RelativeLocation"] = pos["Properties"]["RelativeLocation"]
		results.append(result)
	return results


if __name__ == '__main__':
	files = ['fld001_W_PU.json','fld001_E_PU.json','fld001_N_PU.json','fld001_S_PU.json']
	for file in files:
		with open(file, 'r') as f:
			entry_list = json.load(f)
		results = gen_gather_points(file.split('.')[0], entry_list)
		new_file = file.split('.')[0] + '_output.json'
		with open(new_file, 'w') as f:
			json.dump(results, f)

