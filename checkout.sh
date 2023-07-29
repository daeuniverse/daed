#/bin/bash

ask_continue() {
    read -r -p "All your code changes will be lost, continue? [y/N] " response
    case "$response" in
        [yY][eE][sS]|[yY]) 
            echo $response
            ;;
        *)
            exit 0
            ;;
    esac
}

repo_rinse() {
    git reset --hard
    git pull
    git submodule foreach --recursive git reset --hard
    git submodule update --init --recursive
}

checkout_wing() {
    branch="$1"
    ask_coninue
    repo_rinse
    cd wing && git fetch
    result=$(git branch -l -r "*/$branch")
    if [[ "$result" == "" ]]; then
        echo "No such branch: $branch"
        exit 1
    fi
    git checkout "$branch"
    git pull
    git submodule update --recursive
    go mod tidy
}

checkout_core() {
    branch="$1"
    ask_coninue
    repo_rinse
    cd wing/dae-core && git fetch
    result=$(git branch -l -r "*/$branch")
    if [[ "$result" == "" ]]; then
        echo "No such branch: $branch"
        exit 1
    fi
    git checkout "$branch"
    git pull
    git submodule update --recursive
    cd ..
    go mod tidy
}

show_helps() {
    echo -e "\033[1;4mUsage:\033[0m"
    echo "  $0 [command]"
    echo ' '
    echo -e "\033[1;4mAvailable commands:\033[0m"
    echo "  core <branch>       checkout dae-core to given branch"
    echo "  wing <branch>       checkout dae-wing to given branch"
    echo "  help                show this help message"
}

# Main
set -e
current_dir=$(pwd)
while [ $# != 0 ] ; do
    case "$1" in
        core)
            opt_core=1
            shift
            break
            ;;
        dae-core)
            opt_core=1
            shift
            break
            ;;
        wing)
            opt_wing=1
            shift
            break
            ;;
        dae-wing)
            opt_wing=1
            shift
            break
            ;;
        -h)
            opt_help=1
            shift
            break
            ;;
        *)
            opt_help=1
            echo "${RED}error: Unknown command: $1${RESET}"
            shift
            break
            ;;
    esac
done
if [ ! -z "$opt_help" ];then
    show_helps
    exit 1
fi

if [ ! -z "$opt_core" ];then
    checkout_core $1
    exit 0
fi

if [ ! -z "$opt_wing" ];then
    checkout_wing $1
    exit 0
fi

trap 'cd "$current_dir"' 0 1 2 3