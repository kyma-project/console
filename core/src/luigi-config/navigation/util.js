export function extractKymaVersion(installerDeployment) {
    const image = installerDeployment.spec.template.spec.containers[0].image;

    if (!image.startsWith('eu.gcr.io')) {
        return image;
    }

    const index = Math.max(image.lastIndexOf('/'), image.lastIndexOf(':'));
    if (index === -1) {
        return image;
    }

    const version = image.substring(index+1);
    if (version.startsWith('PR-')) {
        return `pull request ${version}`; 
    }

    return version;
}
