# bash completion for daed                                 -*- shell-script -*-
#
# To be installed in "/usr/share/bash-completion/completions/daed"

_daed() {
	local prev cur cmd export_cmd resetpwd_opts run_opts
	COMPREPLY=()

	prev="${COMP_WORDS[COMP_CWORD-1]}"
	cur="${COMP_WORDS[COMP_CWORD]}"
	cmd="export help resetpass run"
	export_cmd="flatdesc outline schema"
	resetpwd_opts="-c --config"
	run_opts="--api-only -c --config --disable-timestamp -l --listen --logfile\
    --logfile-maxbackups --logfile-maxsize"

	case "${prev}" in
		help)
			return 0
			;;

		flatdesc|outline|schema)
			COMPREPLY=( $(compgen -W "-h --help" -- "${cur}") )
			return 0
			;;

		export)
			COMPREPLY=( $(compgen -W "$export_cmd -h --help" -- "${cur}") )
			return 0
			;;

		resetpass)
			COMPREPLY=( $(compgen -W "$resetpwd_opts -h --help" -- "${cur}") )
			return 0
			;;

		run)
			COMPREPLY=( $(compgen -W "$run_opts -h --help" -- "${cur}") )
			return 0
			;;

		--api-only|--disable-timestamp|-l|--listen|--logfile|\
        --logfile-maxbackup|--logfile-maxsize|-c|--config|*/*)
            
            case "${prev}" in
                --logfile)
                    _filedir
                    return 0
                    ;;
            esac

            case "${prev}" in
                -c|--config)
                    _filedir -d
                    return 0
                    ;;
            esac
            
            # run cmd multi option completetion
            case "${COMP_WORDS[1]}" in 
                run)
                    COMPREPLY=( $(compgen -W "$run_opts" -- "${cur}") )
                    return 0
                    ;;
            esac

            return 0
            ;;

		-h|--help)
			return 0
			;;
		*)
		;;
	esac

	case "${cur}" in
		-*)
			COMPREPLY=( $( compgen -W "--version --help -v -h" -- "${cur}") )
			return 0
			;;
		--*)
			COMPREPLY=( $( compgen -W "--version --help" -- "${cur}") )
			return 0
			;;
		*)
            case "${COMP_WORDS[1]}" in
                export|help|resetpass|run)
                    return 0
                    ;;
            esac
			COMPREPLY=( $( compgen -W "${cmd}" -- "${cur}") )
			return 0
			;;
	
	esac

}

complete -F _daed daed
