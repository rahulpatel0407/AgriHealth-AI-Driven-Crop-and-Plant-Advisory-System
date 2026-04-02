import argparse
import importlib
from pathlib import Path

import yaml


def main(config_path: str):
    # Placeholder training loop
    config = yaml.safe_load(Path(config_path).read_text())
    torch = importlib.import_module("torch")
    models = importlib.import_module("torchvision.models")
    model = models.resnet50(weights=None)
    model.fc = torch.nn.Linear(model.fc.in_features, config["num_classes"])
    # TODO: implement full training and save to ml/models/best_model.pt
    Path("ml/models").mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), "ml/models/best_model.pt")
    print("Saved model to ml/models/best_model.pt")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="ml/config.yaml")
    args = parser.parse_args()
    main(args.config)
