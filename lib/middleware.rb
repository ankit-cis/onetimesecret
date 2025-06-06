# frozen_string_literal: true

require 'logger'
require_relative 'middleware/clear_session_messages'
require_relative 'middleware/header_logger_middleware'
require_relative 'middleware/handle_invalid_percent_encoding'
require_relative 'middleware/handle_invalid_utf8'
require_relative 'middleware/detect_host'
require_relative 'onetime/middleware/domain_strategy'
